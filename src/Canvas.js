import React, { useRef, useEffect } from 'react';

function Canvas(props) {
    const canvasRef = useRef(null);

    // const loadContext = new LoadContext();

    const loadContext = {
        contentSources: [],
        loaded: 0,
    };

    loadContext.addContentSource = (source, name) => {
        let img = new Image();
        img.src = source;
        const index = loadContext.contentSources.length;
        img.onload = () => {
            loadContext.contentSources[index].loaded = true;
            loadContext.loaded++;
            console.log("IMG '" + source + "' named '" + name + "' has been loaded!");
        }
        loadContext.contentSources.push({
            src: source,
            loaded: false,
            img,
            name,
        });
    }

    loadContext.findOrNull = (name) => {
        let img = null;
        loadContext.contentSources.forEach((src) => {
            if(src.name === name) {
                img = src;
            }
        });
        return img;
    }

    loadContext.isLoaded = () => {
        return loadContext.loaded === loadContext.contentSources.length;
    }

    const draw = props.draw;
    const load = props.load;
    load(loadContext);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        let frameCount = 0;
        let animationFrameId;
        const render = () => {
            frameCount++;
            if(loadContext.isLoaded()) {
                draw(context, canvas, frameCount, loadContext);
            }
            if(frameCount % 360 === 0) {
                console.log(loadContext.isLoaded());
            }
            animationFrameId = window.requestAnimationFrame(render);
        }
        render();
        
        return () => {
            window.cancelAnimationFrame(animationFrameId);
        }
    }, [draw]);

    return (
        <canvas ref={canvasRef}/>
    )
}

export default Canvas;