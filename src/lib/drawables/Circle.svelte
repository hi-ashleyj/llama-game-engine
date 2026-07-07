<script lang="ts">

    import { setupDrawable } from "$lib/drawable.js";
    import { onMount } from "svelte";

    interface Props {
        fill?: string | null;
        stroke?: string | null;
        strokeWidth?: number | null;
    }

    let { fill = null, stroke = null, strokeWidth = null }: Props = $props();
    const TWO_PI = Math.PI * 2;

    let register = setupDrawable<{x: number, y: number, w: number, h: number}, null>({ hasChildren: false });

    onMount(() => {
        return register({
            draw: ({ ctx }, { x, y, w, h }) => {
                let r = (w + h) / 4
                        
                ctx.beginPath();
                ctx.arc(x + r, y + r, r, 0, TWO_PI);
                
                if (fill) {
                    ctx.fillStyle = fill;
                    ctx.fill();
                }

                if (stroke && strokeWidth) {
                    ctx.strokeStyle = stroke;
                    ctx.lineWidth = strokeWidth;
                    ctx.stroke();
                }
            }
        });
    })
</script>