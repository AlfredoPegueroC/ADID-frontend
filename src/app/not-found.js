import Image from "next/image";

export default function NotFound() {
  return (
    <div className="not_found">
      <Image
        src="/undraw_page-not-found.svg"
        alt="excel"
        width={720}
        height={720}
      />
      <p>Pagina no encontrada.</p>
    </div>
  );
}
