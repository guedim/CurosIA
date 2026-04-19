"""
Script para leer códigos de autenticador de 6 dígitos desde la cámara del celular
Captura continuamente cada 5 segundos y guarda las fotos en carpeta fotos/
"""

import cv2
import easyocr
import time
import re
import os
import shutil
from datetime import datetime

# Deshabilitar GUI de OpenCV
os.environ["OPENCV_VIDEOIO_PRIORITY_MSMF"] = "0"

FOTOS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'fotos')

class AuthenticatorReader:
    def __init__(self):
        print("Inicializando lector OCR...")
        self.reader = easyocr.Reader(['en'], gpu=False)

        # Dispositivo de video:
        #   0 = Webcam integrada del laptop
        #   2 = DroidCam (loopback virtual, /dev/video2)
        # Para identificar dispositivos disponibles en Linux:
        #   cat /sys/class/video4linux/video*/name
        self.camera = cv2.VideoCapture(2)

        if not self.camera.isOpened():
            raise Exception("No se pudo acceder a la cámara")

        # Limpiar y recrear carpeta fotos
        if os.path.exists(FOTOS_DIR):
            shutil.rmtree(FOTOS_DIR)
        os.makedirs(FOTOS_DIR)

        self.no_leida_counter = 0
        print("Cámara inicializada correctamente")

    def extract_6digit_code(self, text):
        """Extraer código de 6 dígitos del texto detectado"""
        pattern = r'\b\d{6}\b'
        matches = re.findall(pattern, text)
        if matches:
            return matches[0]
        return None

    def capture_and_read(self):
        """Capturar frame y leer el código"""
        ret, frame = self.camera.read()

        if not ret:
            print("Error al capturar imagen")
            return None

        # Convertir a escala de grises
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        timestamp = datetime.now().strftime("%H:%M:%S")
        print(f"\n[{timestamp}] Procesando imagen...")

        # Intentar OCR con escala de grises
        results = self.reader.readtext(gray, detail=1, paragraph=False)
        all_text = ' '.join([r[1] for r in results])
        print(f"[{timestamp}] Texto detectado (gris): {all_text}")

        code = self.extract_6digit_code(all_text)

        if not code:
            # Intentar con umbral binario
            _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
            results = self.reader.readtext(thresh, detail=1, paragraph=False)
            all_text = ' '.join([r[1] for r in results])
            print(f"[{timestamp}] Texto detectado (umbral): {all_text}")
            code = self.extract_6digit_code(all_text)

        # Guardar foto con nombre según resultado
        if code:
            foto_path = os.path.join(FOTOS_DIR, f'{code}.png')
        else:
            self.no_leida_counter += 1
            foto_path = os.path.join(FOTOS_DIR, f'foto_no_leida_{self.no_leida_counter}.png')

        cv2.imwrite(foto_path, frame)
        print(f"Foto guardada: {foto_path}")

        return code

    def log_code(self, code):
        """Registrar código con timestamp"""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        log_entry = f"[{timestamp}] Código capturado: {code}"
        print(log_entry)

        with open('authenticator_log.txt', 'a') as f:
            f.write(log_entry + '\n')

    def run(self):
        """Ejecutar el lector continuamente cada 5 segundos"""
        print("\n=== Lector de Autenticador Iniciado ===")
        print("Captura cada 5 segundos")
        print("Presiona Ctrl+C para detener\n")

        last_code = None

        try:
            while True:
                code = self.capture_and_read()

                if code:
                    if code != last_code:
                        self.log_code(code)
                        last_code = code
                    else:
                        print(f"Mismo código detectado: {code}")
                else:
                    print("No se detectó código de 6 dígitos")

                print("-" * 50)
                time.sleep(5)

        except KeyboardInterrupt:
            print("\n\nDeteniendo lector...")
        finally:
            self.cleanup()

    def cleanup(self):
        """Liberar recursos"""
        self.camera.release()
        print("Recursos liberados. Adiós!")


if __name__ == "__main__":
    reader = AuthenticatorReader()
    reader.run()
