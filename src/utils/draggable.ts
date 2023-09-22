/* eslint-disable @typescript-eslint/no-explicit-any */
import interact from "interactjs";

export function draggable(node: HTMLElement): void {
  interact(node)
    .draggable({
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: "parent",
        }),
      ],
      listeners: {
        move: (event: Interact.InteractEvent) => {
          const { dx, dy } = event;
          const target = event.target as HTMLElement;

          const x = (parseFloat(target.getAttribute("data-x")!) || 0) + dx;
          const y = (parseFloat(target.getAttribute("data-y")!) || 0) + dy;

          target.style.transform = `translate(${x}px, ${y}px)`;

          target.setAttribute("data-x", x.toString());
          target.setAttribute("data-y", y.toString());
        },
      },
    })
    .resizable({
      edges: { left: true, right: true, bottom: true, top: true },
      modifiers: [
        interact.modifiers.restrictSize({
          min: { width: 50, height: 50 },
        }),
      ],
      listeners: {
        move: (event: any) => {
          const { width, height } = event.rect;
          const { left, top } = event.deltaRect;
          const target = event.target as HTMLElement;

          target.style.width = `${width}px`;
          target.style.height = `${height}px`;

          target.style.transform += `translate(${left}px, ${top}px)`;
        },
        end: (event: Interact.InteractEvent) => {
          const target = event.target as HTMLElement;

          const x = parseFloat(target.getAttribute("data-x")!) || 0;
          const y = parseFloat(target.getAttribute("data-y")!) || 0;

          target.setAttribute("data-x", x.toString());
          target.setAttribute("data-y", y.toString());
        },
      },
    });
}
