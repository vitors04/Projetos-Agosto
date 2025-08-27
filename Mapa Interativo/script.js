document.addEventListener('DOMContentLoaded', () => {
    const mapContainer = document.getElementById('map-container');
    const mapInner = document.getElementById('map-inner');
    const interactiveMapImage = document.getElementById('interactive-map-image');
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');
    const resetZoomBtn = document.getElementById('reset-zoom');
    const hotspots = document.querySelectorAll('.hotspot');
    let currentZoom = 1;
    const ZOOM_STEP = 0.2;
    const MIN_ZOOM = 1;
    const MAX_ZOOM = 4;
    let isDragging = false;
    let startX, startY;
    let currentPanX = 0, currentPanY = 0;

    function applyZoomAndPan() {
        mapInner.style.transform = `translate(${currentPanX}px, ${currentPanY}px) scale(${currentZoom})`;
    }

    function zoom(direction) {
        let newZoom = currentZoom + (direction * ZOOM_STEP);
        newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newZoom));

        if (newZoom === currentZoom) return;

        const containerRect = mapContainer.getBoundingClientRect();
        const mapInnerRect = mapInner.getBoundingClientRect();

        const oldMapWidth = mapInnerRect.width;
        const oldMapHeight = mapInnerRect.height;

        const zoomRatio = newZoom / currentZoom;

        const mouseX = containerRect.width / 2;
        const mouseY = containerRect.height / 2;

        currentPanX = (currentPanX - mouseX) * zoomRatio + mouseX;
        currentPanY = (currentPanY - mouseY) * zoomRatio + mouseY;
        
        currentZoom = newZoom;
        adjustPanBounds();
        applyZoomAndPan();
    }

    function resetZoom() {
        currentZoom = MIN_ZOOM;
        currentPanX = 0;
        currentPanY = 0;
        applyZoomAndPan();
    }

    function adjustPanBounds() {
        const containerRect = mapContainer.getBoundingClientRect();
        const mapScaledWidth = interactiveMapImage.offsetWidth * currentZoom;
        const mapScaledHeight = interactiveMapImage.offsetHeight * currentZoom;

        const maxPanX = Math.max(0, mapScaledWidth - containerRect.width);
        const maxPanY = Math.max(0, mapScaledHeight - containerRect.height);

        currentPanX = Math.max(-maxPanX, Math.min(currentPanX, 0));
        currentPanY = Math.max(-maxPanY, Math.min(currentPanY, 0));

        if (mapScaledWidth < containerRect.width) {
            currentPanX = (containerRect.width - mapScaledWidth) / 2;
        }
        if (mapScaledHeight < containerRect.height) {
            currentPanY = (containerRect.height - mapScaledHeight) / 2;
        }
    }

    mapContainer.addEventListener('mousedown', (e) => {
        if (e.button === 0 && currentZoom > MIN_ZOOM) {
            isDragging = true;
            mapContainer.style.cursor = 'grabbing';
            startX = e.clientX - currentPanX;
            startY = e.clientY - currentPanY;
        }
    });

    mapContainer.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        currentPanX = e.clientX - startX;
        currentPanY = e.clientY - startY;
        adjustPanBounds();
        applyZoomAndPan();
    });

    mapContainer.addEventListener('mouseup', () => {
        isDragging = false;
        mapContainer.style.cursor = 'grab';
    });

    mapContainer.addEventListener('mouseleave', () => {
        isDragging = false;
        mapContainer.style.cursor = 'grab';
    });
    
    hotspots.forEach(hotspot => {
        hotspot.addEventListener('click', (e) => {
            e.stopPropagation();
            alert(`Você clicou no hotspot: ${hotspot.id}\n${hotspot.querySelector('.hotspot-tooltip').textContent}`);
        });
    });

    zoomInBtn.addEventListener('click', () => zoom(1));
    zoomOutBtn.addEventListener('click', () => zoom(-1));
    resetZoomBtn.addEventListener('click', resetZoom);

    // Initial application of styles
    applyZoomAndPan();
});