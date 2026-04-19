# Geocodificador

Este proyecto contiene un script en Python diseñado para procesar un listado de dirección en Colombia, limpiar la nomenclatura de las direcciones para hacerlas legibles por sistemas GPS, y obtener sus coordenadas geográficas (**Latitud y Longitud**) utilizando el servicio de geocodificación de **ArcGIS**.

## 📋 Características

* **Limpieza Inteligente:** Utiliza expresiones regulares (Regex) para eliminar "ruido" de las direcciones (ej. "Local 104", "Centro Comercial", "Bodega") que suelen confundir a los geocodificadores.
* **Estandarización:** Convierte abreviaturas comunes (Cra, K, Cll) a formato estándar (CARRERA, CALLE).
* **Geocodificación Robusta:** Utiliza la API de **ArcGIS** (no requiere Key gratuita) que tiene mayor precisión en Colombia que OpenStreetMap/Nominatim.
* **Sistema de Respaldo (Fallback):** Si una dirección exacta no se encuentra, el script busca automáticamente la ubicación de la **Ciudad + Departamento** para asegurar que ninguna fila quede vacía.
* **Exportación:** Genera un archivo Excel (`.xlsx`) listo para usar en herramientas de BI (PowerBI, Tableau, Google Maps).

## 🛠️ Requisitos Previos

* Tener instalado **Python 3.7** o superior.
* Conexión a Internet (para consultar la API de mapas).

## 📦 Instalación de Dependencias

Para ejecutar el script, necesitas instalar las siguientes librerías de Python.

Puedes instalar todo ejecutando el siguiente comando en tu terminal:

```bash
pip install pandas geopy openpyxl

```

### Detalle de librerías:

* `pandas`: Para la manipulación de datos y lectura/escritura de archivos (CSV/Excel).
* `geopy`: Para la conexión con los servicios de geolocalización (ArcGIS).
* `openpyxl`: Motor necesario para que pandas pueda exportar archivos `.xlsx`.

## 🚀 Guía de Uso

### 1. Preparar el archivo de entrada

El script busca un archivo llamado **`oficinas.csv`** en la misma carpeta donde se ejecuta el código.

* **Nombre del archivo:** `oficinas.csv`
* **Formato:** CSV delimitado por punto y coma (`;`) o comas (`,`).
* **Columnas requeridas:** El archivo debe tener al menos las siguientes cabeceras:
* `Direccion`
* `Ciudad`
* `Departamento`



### 2. Ejecutar el Script

Guarda el código Python proporcionado anteriormente en un archivo llamado `geocodificador.py` y ejecútalo desde tu terminal:

```bash
python geocodificador.py

```

Verás una barra de progreso en la consola indicando cuántas filas se han procesado.

### 3. Resultados

Al finalizar, el script generará un nuevo archivo llamado **`Oficinas_Geocodificadas_Final.xlsx`**.

Este archivo contendrá las columnas originales más:

* **Direccion_Limpia:** La dirección tal como se envió al GPS.
* **Latitud:** Coordenada Y.
* **Longitud:** Coordenada X.
* **Estado:** Indica la calidad del resultado:
* `Exacta`: Se encontró la dirección específica.
* `Aproximada (Solo Ciudad)`: No se encontró la calle, se usó el centroide de la ciudad.
* `Fallida`: No se encontró ni la ciudad.



## ⚠️ Notas Importantes

1. **Velocidad:** El servicio de ArcGIS es gratuito pero tiene límites de velocidad. El script incluye pausas automáticas (`min_delay_seconds=0.5`) para evitar bloqueos. Procesar 200 registros tomará aproximadamente **2 a 3 minutos**.
2. **Precisión:** Aunque el script limpia las direcciones, la precisión depende de la cartografía de ArcGIS. Siempre verifica visualmente los puntos marcados como `Exacta` si son críticos para tu negocio.
3. **Codificación:** El script intenta leer automáticamente formatos `UTF-8` y `Latin-1`. Si tienes problemas con tildes (ñ, á, é), asegúrate de guardar tu CSV original como "CSV UTF-8".