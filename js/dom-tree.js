/**
 * DOM Tree Visualizer - Muestra la estructura del árbol DOM
 */
class DOMTreeVisualizer {
    constructor() {
        this.container = document.body;
        this.idCounter = 0;
        this.functionIds = new Map();
        this.generateTree();
    }
    
    generateTree() {
        console.log('=== ÁRBOL DOM - CARRUSEL ===\n');
        console.log('📁 Document\n');
        
        const root = document.documentElement;
        this.traverseNode(root, 0);
        
        console.log('\n=== COMPONENTES IDENTIFICADOS ===\n');
        this.displayFunctionIds();
        
        console.log('\n=== ESTRUCTURA DE COMPONENTES ===\n');
        this.displayComponentStructure();
    }
    
    traverseNode(node, level) {
        const indent = '  '.repeat(level);
        const prefix = level === 0 ? '└─ ' : '├─ ';
        
        if (node.nodeType === Node.ELEMENT_NODE) {
            const tagName = node.tagName.toLowerCase();
            const id = node.id ? `#${node.id}` : '';
            const classes = node.className ? `.${node.className.replace(/ /g, '.')}` : '';
            const dataAttr = this.getDataAttributes(node);
            
            if (node.id) {
                this.registerFunctionId(node.id, tagName, node);
            }
            
            console.log(`${indent}${prefix}${tagName}${id}${classes}${dataAttr}`);
            
            if (node.children.length === 0 && node.textContent.trim()) {
                const text = node.textContent.trim().substring(0, 30);
                if (text) {
                    console.log(`${indent}  ├─ Text: "${text}"`);
                }
            }
            
            Array.from(node.children).forEach(child => {
                this.traverseNode(child, level + 1);
            });
        }
    }
    
    getDataAttributes(element) {
        const dataAttrs = [];
        for (const attr of element.attributes) {
            if (attr.name.startsWith('data-')) {
                dataAttrs.push(`${attr.name}="${attr.value}"`);
            }
        }
        return dataAttrs.length ? ` (${dataAttrs.join(', ')})` : '';
    }
    
    registerFunctionId(id, type, element) {
        this.functionIds.set(id, {
            type: type,
            element: element,
            description: this.getElementDescription(element)
        });
    }
    
    getElementDescription(element) {
        const descriptions = {
            'carruselTrack': 'Track del carrusel - Contiene todas las imágenes',
            'prevBtn': 'Botón - Imagen anterior',
            'nextBtn': 'Botón - Siguiente imagen',
            'indicators': 'Indicadores de posición',
            'counter': 'Contador de imagen actual',
            'playBtn': 'Botón - Pausar/Reanudar autoplay'
        };
        
        if (element.id && descriptions[element.id]) {
            return descriptions[element.id];
        }
        
        if (element.classList.contains('carrusel-item')) {
            const index = element.dataset.index;
            return `Imagen ${parseInt(index) + 1}`;
        }
        
        if (element.classList.contains('dot')) {
            const index = element.dataset.index;
            return `Indicador posición ${parseInt(index) + 1}`;
        }
        
        return `Elemento ${element.tagName.toLowerCase()}`;
    }
    
    displayFunctionIds() {
        console.log('IDs y funciones:');
        for (const [id, info] of this.functionIds) {
            console.log(`  🆔 ${id} → ${info.description}`);
        }
    }
    
    displayComponentStructure() {
        console.log(`
        ┌─ CarruselApp
        │  ├─ Header
        │  │  ├─ Título "Galería"
        │  │  └─ Subtítulo "Explora nuestra colección"
        │  └─ CarruselWrapper
        │     ├─ Carrusel
        │     │  ├─ Track (#carruselTrack)
        │     │  │  ├─ Item (x5) - Imágenes
        │     │  │  │  ├─ Imagen
        │     │  │  │  └─ Overlay con número
        │     │  ├─ PrevBtn (#prevBtn) ←
        │     │  └─ NextBtn (#nextBtn) →
        │     └─ Controls
        │        ├─ Indicators (#indicators)
        │        │  └─ Dot (x5)
        │        └─ Info
        │           ├─ Counter (#counter)
        │           └─ PlayBtn (#playBtn) ⏯
        `);
    }
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const treeVisualizer = new DOMTreeVisualizer();
        window.domTree = treeVisualizer;
        window.visualizeDOM = () => treeVisualizer.generateTree();
        
        console.log('✅ DOM Tree generado');
        console.log('💡 Usa window.visualizeDOM() para ver el árbol');
        console.log('💡 Usa window.carruselApp para acceder al carrusel');
    }, 100);
});