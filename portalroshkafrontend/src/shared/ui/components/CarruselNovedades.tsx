
// import { useState, useEffect } from 'react'
// import { NovedadesResponseDto } from '@/types'

// export default function CarruselNovedades({ items }: { items: NovedadesResponseDto[] }) {
//   const [index, setIndex] = useState(0)

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setIndex((prev) => (prev + 1) % items.length)
//     }, 5000)
//     return () => clearInterval(interval)
//   }, [items])

//   if (!items.length) return <p>No hay novedades</p>

//   return (
//     <div className="relative w-full h-64 overflow-hidden rounded-xl">
//       {items.map((n, i) => (
//         <div
//           key={n.idNovedades}
//           className={`absolute inset-0 transition-opacity duration-700 ${
//             i === index ? 'opacity-100' : 'opacity-0'
//           }`}
//         >
//           <img src={n.imagenUrl} className="w-full h-full object-cover" />

//           <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4">
//             <h3>{n.titulo}</h3>
//           </div>
//         </div>
//       ))}
//     </div>
//   )
// }


