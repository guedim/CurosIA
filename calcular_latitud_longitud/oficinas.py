import pandas as pd
from geopy.geocoders import ArcGIS
from geopy.extra.rate_limiter import RateLimiter
import re
import time

# 1. Cargar el archivo
# Ajusta el separador (sep) si tu CSV usa comas en lugar de punto y coma
try:
    df = pd.read_csv('oficinas.csv', sep=';', encoding='utf-8')
except:
    df = pd.read_csv('oficinas.csv', sep=',', encoding='latin1')

print(f"Total de registros a procesar: {len(df)}")

# 2. Función avanzada de limpieza de direcciones colombianas
def limpiar_direccion(texto):
    if not isinstance(texto, str):
        return ""
    
    texto = texto.upper().strip()
    
    # a. Eliminar información de interiores/locales que confunde al GPS
    # Elimina desde la palabra clave hasta el final o hasta el siguiente guion/espacio raro
    patrones_ruido = [
        r'LOCAL.*', r'LOC\..*', r'L-.*', r'OFICINA.*', r'OF\..*', 
        r'INT\..*', r'PISO.*', r'BODEGA.*', r'CC.*', r'C\.C\..*', 
        r'CENTRO COMERCIAL.*', r'EDIFICIO.*'
    ]
    
    for patron in patrones_ruido:
        texto = re.sub(patron, '', texto)
    
    # b. Estandarizar nomenclatura vial
    reemplazos = {
        r'\bCR\b': 'CARRERA', r'\bCRA\b': 'CARRERA', r'\bKR\b': 'CARRERA', r'\bK\b': 'CARRERA',
        r'\bCL\b': 'CALLE', r'\bCLL\b': 'CALLE',
        r'\bDG\b': 'DIAGONAL', r'\bDIG\b': 'DIAGONAL',
        r'\bTR\b': 'TRANSVERSAL', r'\bTV\b': 'TRANSVERSAL',
        r'\bAV\b': 'AVENIDA',
        r'\bNO\b': '', r'\bN\°\b': '', # Eliminar 'No' o 'N°'
    }
    
    for viejo, nuevo in reemplazos.items():
        texto = re.sub(viejo, nuevo, texto)
    
    # c. Limpiar caracteres especiales sobrantes
    texto = texto.replace('#', '').strip()
    
    return texto

# 3. Aplicar limpieza
print("Limpiando direcciones...")
df['Direccion_Limpia'] = df['Direccion'].apply(limpiar_direccion)

# 4. Crear la cadena de búsqueda completa
# Estructura: Dirección Limpia, Ciudad, Departamento, Colombia
df['Busqueda'] = df['Direccion_Limpia'] + ', ' + df['Ciudad'] + ', ' + df['Departamento'] + ', Colombia'

# 5. Configurar Geocodificador (Usamos ArcGIS que es mejor para Colombia que Nominatim)
geolocator = ArcGIS(user_agent="app_geo_colombia")
geocode = RateLimiter(geolocator.geocode, min_delay_seconds=0.5)

# 6. Función de Geocodificación con manejo de errores
def obtener_lat_lon(direccion):
    try:
        location = geolocator.geocode(direccion, timeout=10)
        if location:
            return pd.Series([location.latitude, location.longitude, "Exacta"])
        else:
            return pd.Series([None, None, "Fallida"])
    except Exception as e:
        print(f"Error en: {direccion} - {e}")
        return pd.Series([None, None, "Error"])

# 7. Ejecutar proceso (Con barra de progreso simple)
print("Iniciando búsqueda de coordenadas (esto puede tardar unos minutos)...")

# Crear columnas vacías
df[['Latitud', 'Longitud', 'Estado']] = None

# Procesar por lotes o fila por fila
# Usamos un bucle simple para ver progreso
total = len(df)
for index, row in df.iterrows():
    if index % 10 == 0:
        print(f"Procesando {index}/{total}...")
    
    # Intento 1: Dirección completa
    res = obtener_lat_lon(row['Busqueda'])
    
    # Intento 2: Fallback (Si falla, buscar solo Ciudad, Departamento para no dejar vacío)
    if res[2] == "Fallida":
        busqueda_simple = row['Ciudad'] + ', ' + row['Departamento'] + ', Colombia'
        res = obtener_lat_lon(busqueda_simple)
        res[2] = "Aproximada (Solo Ciudad)" # Marcar como aproximada
        
    df.loc[index, ['Latitud', 'Longitud', 'Estado']] = res.values

# 8. Guardar resultado
archivo_salida = "Oficinas_Geocodificadas_Final.xlsx"
df.to_excel(archivo_salida, index=False)
print(f"¡Listo! Archivo guardado como: {archivo_salida}")
print(df[['Direccion', 'Latitud', 'Longitud', 'Estado']].head(10))