// Serve original SVG exports unchanged, at their intrinsic dimensions.
export function QrImage({ name, width, height, svg, alt = "" }: {
  name: string; width: number; height: number; svg: string; alt?: string;
}) {
  const src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  // Raster optimization is unnecessary for the original vector artwork.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} width={width} height={height} alt={alt} className="block max-w-none shrink-0" draggable={false} />;
}
