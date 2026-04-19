# Lector de Autenticador con OCR

Script Python simple para capturar códigos de autenticador de 6 dígitos desde la cámara.

## Requisitos Previos

| Requisito    | Detalle                                         |
|-------------|--------------------------------------------------|
| **Python**  | 3.8 o superior                                   |
| **Sistema** | Linux, Windows o macOS                           |
| **Cámara**  | Webcam o cámara del celular (DroidCam, IP Webcam)|
| **Disco**   | ~1-2 GB para dependencias (PyTorch + EasyOCR)    |
| **RAM**     | 4 GB mínimo recomendado                          |

## Ambiente Virtual de Python

Se recomienda usar un entorno virtual para aislar las dependencias del proyecto.

### Crear el entorno

```bash
cd /mnt/sda7/mario/ocr
python3 -m venv venv
```

### Activar el entorno

**Linux/macOS:**
```bash
source venv/bin/activate
```

**Windows (CMD):**
```bash
venv\Scripts\activate.bat
```

**Windows (PowerShell):**
```bash
venv\Scripts\Activate.ps1
```

Cuando el entorno esté activo, verás `(venv)` en tu prompt.

## Instalación

1. Con el entorno virtual activado, instalar las dependencias:
```bash
pip install --upgrade pip
pip install -r Requirements.txt
```

**Nota:** EasyOCR instala PyTorch como dependencia, lo que puede tomar varios minutos. La primera vez que ejecutes el script, EasyOCR descargará modelos de reconocimiento (~100MB). Esto solo ocurre una vez.

## Uso

1. Ejecutar el script:
```bash
python lector_autenticador.py
```

2. Posiciona tu celular o pantalla con el código de autenticador frente a la cámara

3. El script capturará el código cada 5 segundos automáticamente

4. Los códigos se guardan en `authenticator_log.txt` con timestamp

5. Para detener: presiona `Ctrl+C`

## Conectar Cámara del Celular

Si quieres usar la cámara de tu celular en lugar de la webcam:

### Opción 1: DroidCam (Recomendada)
1. Instala DroidCam en tu celular (Android/iOS)
2. Instala el cliente DroidCam en tu PC:
```bash
sudo apt install linux-headers-$(uname -r) v4l2loopback-dkms adb
cd /tmp/
wget -O droidcam_latest.zip https://files.dev47apps.net/linux/droidcam_2.1.4.zip
unzip droidcam_latest.zip -d droidcam
cd droidcam && sudo ./install-client
sudo ./install-video
```
3. Conecta vía WiFi o USB

### Opción 2: IP Webcam (Android)
1. Instala "IP Webcam" desde Play Store
2. Inicia el servidor en la app
3. Modifica el script para usar la URL IP:
```python
self.camera = cv2.VideoCapture("http://TU_IP:8080/video")
```

## Funcionamiento

El script:
1. Captura imagen de la cámara cada 5 segundos
2. Preprocesa la imagen (escala de grises, umbralización)
3. Usa OCR para detectar texto
4. Extrae códigos de exactamente 6 dígitos
5. Registra el código con fecha/hora
6. Solo guarda códigos nuevos (evita duplicados)

## Salida

Los códigos se guardan en `authenticator_log.txt`:
```
[2026-02-14 15:30:00] Código capturado: 123456
[2026-02-14 15:31:00] Código capturado: 789012
```

## Prueba Rápida

El proyecto incluye el archivo `generar_numeros.html` que genera códigos de 6 dígitos aleatorios. Ábrelo en el navegador y apunta la cámara a la pantalla para probar que el script detecta los números correctamente.

## Consejos para Mejor Precisión

- Buena iluminación
- Código visible y enfocado
- Tamaño de texto grande en pantalla
- Fondo contrastante (texto oscuro en fondo claro)

## Checklist de Ejecución

| Paso | Comando/Acción |
|------|----------------|
| 1 | Verificar Python 3.8+: `python3 --version` |
| 2 | Ir al directorio del proyecto: `cd /mnt/sda7/mario/ocr` |
| 3 | Crear entorno virtual: `python3 -m venv venv` |
| 4 | Activar entorno: `source venv/bin/activate` (Linux/macOS) |
| 5 | Instalar dependencias: `pip install -r Requirements.txt` |
| 6 | Ejecutar el script: `python lector_autenticador.py` |

## Resumen Rápido

```bash
cd /mnt/sda7/mario/ocr
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r Requirements.txt
python lector_autenticador.py
```

## Posibles Problemas

- **Cámara no detectada:** Verifica permisos del sistema y que la cámara esté conectada correctamente.
- **Se captura la cámara equivocada (ej: webcam del laptop en lugar de DroidCam):**
  El script usa `cv2.VideoCapture(2)` que corresponde a `/dev/video2` (DroidCam). Si tu dispositivo es diferente, identifica el correcto con:
  ```bash
  cat /sys/class/video4linux/video*/name
  ```
  Ejemplo de salida:
  ```
  /sys/class/video4linux/video0/name → Integrated_Webcam_HD  (webcam laptop)
  /sys/class/video4linux/video1/name → Integrated_Webcam_HD  (webcam laptop)
  /sys/class/video4linux/video2/name → Loopback video device  (DroidCam)
  ```
  Luego cambia el número en `lector_autenticador.py`:
  ```python
  self.camera = cv2.VideoCapture(2)  # Cambiar al número correcto
  ```
- **Memoria insuficiente:** PyTorch/EasyOCR pueden consumir 2-4 GB de RAM; asegúrate de tener suficiente.
- **Lentitud:** El script usa `gpu=False`, así que la inferencia se ejecuta en CPU; puede ser lento en hardware modesto.