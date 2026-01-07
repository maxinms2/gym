# 🚀 Despliegue en AWS EC2 - Guía Completa

## PASO 1: Crear instancia EC2

1. Accede a [AWS Console](https://console.aws.amazon.com)
2. Ve a **EC2 → Instances → Launch Instances**
3. **Configuración recomendada:**
   - **AMI**: Ubuntu 22.04 LTS (gratuita en tier)
   - **Instance Type**: `t2.micro` (gratuita)
   - **Key Pair**: Descarga `.pem` file (guárdalo seguro)
   - **VPC/Subnet**: Default está bien
   - **Storage**: 20GB (suficiente)

4. **Security Group - IMPORTANTE:**
   Agregar reglas de entrada:
   - SSH (22): Tu IP
   - HTTP (80): 0.0.0.0/0 (cualquiera)
   - Custom TCP (3000): 0.0.0.0/0 (API)
   - Custom TCP (8081): 0.0.0.0/0 (Expo)

---

## PASO 2: Conectarse a la instancia

Una vez creada, copia la **IP pública** (ej: `44.123.45.67`)

**En PowerShell/Terminal (local):**
```bash
# Windows: Descarga PuTTY o usa WSL
# Linux/Mac: usa ssh directamente

ssh -i "tu-key.pem" ubuntu@44.123.45.67
```

---

## PASO 3: Preparar la máquina (en AWS)

Una vez conectado por SSH:

```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Docker
sudo apt install -y docker.io docker-compose

# Agregar permisos (sin sudo)
sudo usermod -aG docker $USER
newgrp docker

# Verificar instalación
docker --version
docker-compose --version
```

---

## PASO 4: Copiar proyecto a AWS

### Opción A: Desde tu PC local (PowerShell)
```bash
scp -i "tu-key.pem" -r "C:\temp\saw2\gym" ubuntu@44.123.45.67:~/
```

### Opción B: Clonar desde GitHub (más fácil)
```bash
# En la sesión SSH de AWS:
git clone https://github.com/tuusuario/gym.git
cd gym
```

---

## PASO 5: Actualizar IP en docker-compose.aws.yml

En AWS, edita el archivo:
```bash
nano docker-compose.aws.yml
```

Cambia `44.123.45.67` por tu **IP pública real** de AWS:

```yaml
environment:
  API_URL: http://44.123.45.67:3000  # ← Reemplaza con tu IP
```

Guarda con `CTRL+X`, luego `Y`, luego `ENTER`

---

## PASO 6: Levantar los contenedores

```bash
# En AWS, dentro de ~/gym:
docker-compose -f docker-compose.aws.yml up -d

# Verificar que estén corriendo:
docker-compose ps
```

Deberías ver:
```
gym_mongo   Running
gym_api     Running
gym_front   Running
```

---

## PASO 7: Verificar que funcione

Espera 30 segundos y en otra terminal:

```bash
# Probar API
curl http://localhost:3000
# Respuesta: "API OK"

# Ver logs
docker-compose logs -f gym_front
```

---

## 🌐 Conectarse desde distintos lugares

### 1️⃣ NAVEGADOR (web)

**Desde cualquier navegador:**
```
http://44.123.45.67:8081
```

### 2️⃣ TELÉFONO CON EXPO GO

#### Opción A: Escanear QR (automático)
```bash
# En AWS, en la terminal donde corre Expo:
# Debería mostrar un QR, escanéalo con Expo Go
```

#### Opción B: URL manual (si no ves QR)
1. Abre Expo Go en tu celular
2. Toca "Connection"
3. Selecciona "LAN"
4. Ingresa la URL:
   ```
   exp://44.123.45.67:8081
   ```

**⚠️ IMPORTANTE:**
- El celular **NO necesita estar en la misma red Wi-Fi**
- Funciona por **internet público** (usa IP pública de AWS)
- Solo debe tener conexión a internet

---

## 🔧 Solución de problemas

### Problema: "Connection refused" desde navegador
```bash
# En AWS, verifica puertos
sudo netstat -tlnp | grep LISTEN

# Si no ves 8081/3000, los contenedores no levantaron:
docker-compose logs
```

### Problema: Expo Go se queda en "Connecting..."
1. Verifica que el Security Group permita puerto 8081
2. Comprueba la IP pública es correcta
3. Comprueba docker está corriendo: `docker ps`

### Problema: "API Error" desde el celular
- Asegúrate de actualizar `docker-compose.aws.yml` con la IP correcta
- La IP debe ser la **pública** de AWS (ej: 44.123.45.67)

### Problema: "Permission denied" en SSH
```bash
# Cambiar permisos del archivo .pem
chmod 400 tu-key.pem
```

### Problema: Docker requiere sudo
```bash
# Si no agregaste usuario al grupo docker:
sudo usermod -aG docker $USER
# Cierra sesión y abre nueva terminal
```

---

## 📋 Checklist final

- [ ] EC2 creada con Ubuntu 22.04
- [ ] Security Group abierto (22, 80, 3000, 8081)
- [ ] SSH conectado: `ssh -i key.pem ubuntu@IP`
- [ ] Docker instalado: `docker --version`
- [ ] Proyecto en AWS: `~/gym`
- [ ] `docker-compose.aws.yml` con IP correcta
- [ ] Contenedores corriendo: `docker-compose ps`
- [ ] Acceso web: `http://IP:8081` funciona ✅
- [ ] Expo Go conecta: `exp://IP:8081` ✅

---

## 📝 Comandos útiles en AWS

```bash
# Ver estado de contenedores
docker-compose ps

# Ver logs en tiempo real
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f gym_front

# Detener contenedores
docker-compose down

# Reiniciar contenedores
docker-compose restart

# Ver recursos usados
docker stats

# Acceder a contenedor MongoDB
docker exec -it gym_mongo mongo

# Ver dirección IP de los contenedores
docker network inspect gym_gym_net
```

---

## 🔐 Notas de seguridad

⚠️ **NO dejes los puertos abiertos a 0.0.0.0/0 en producción**

Para más seguridad:
1. Usa Security Groups más restrictivos (solo IPs de confianza)
2. Agrega autenticación en la API
3. Usa HTTPS/SSL
4. Configura un Load Balancer
5. Monitorea logs constantemente

---

## Próximos pasos

Una vez que todo funcione:
1. Configura dominio personalizado
2. Agrega SSL/HTTPS
3. Configura backups de MongoDB
4. Configura auto-scaling
5. Configura CloudWatch para monitoreo

