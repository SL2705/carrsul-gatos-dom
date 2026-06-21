# Carrusel de Gatos - Aplicación Web

Una aplicación de carrusel de imágenes moderna, minimalista y responsive con navegación por botones e indicadores.

## Características

- **5 imágenes** en carrusel
- **Navegación**: Botones siguiente/anterior
- **Indicadores visuales**: Puntos de navegación
- **Contador**: Muestra la posición actual
- **Autoplay**: Cambio automático cada 5 segundos
- **Responsive**: Adaptado a todos los tamaños de pantalla
- **Touch**: Soporte para swipe en dispositivos móviles
- **Teclado**: Navegación con flechas izquierda/derecha
- **Interfaz moderna**: Diseño minimalista con efectos de transición


##  Instalación y Uso

1. **Clonar o descargar** el proyecto
2. **Agregar imágenes**: Coloca tus imágenes en la carpeta `images/` con los nombres `1.jpeg`, `2.jpeg`, `3.jpeg`, `4.jpeg`, `5.jpeg`
3. **Abrir**: Abre `index.html` en tu navegador

##  Funcionalidades

### Navegación
- **Botones**: Flechas izquierda/derecha
- **Indicadores**: Click en los puntos para ir a la imagen
- **Teclado**: Flechas del teclado
- **Touch**: Deslizar en móviles

### Autoplay
- Inicia automáticamente al cargar la página
- Se pausa al hacer hover sobre el carrusel
- Se reinicia al interactuar con el carrusel

## Métodos

### Clase Carrusel

```javascript
// Crear instancia
const carrusel = new Carrusel({
    autoPlayDelay: 5000  // Tiempo entre cambios (ms)
});

// Métodos públicos
carrusel.next()     // Siguiente imagen
carrusel.prev()     // Imagen anterior
carrusel.goTo(index) // Ir a una imagen específica
carrusel.startAutoPlay() // Iniciar autoplay
carrusel.stopAutoPlay()  // Detener autoplay
carrusel.destroy()  // Limpiar recursos
