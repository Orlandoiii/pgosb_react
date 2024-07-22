import React from "react"
export default function ComingSoonPage({ }) {
    return (
        <div className="h-full w-full flex flex-col justify-center items-center bg-gray-100">
            <img src="https://images.unsplash.com/photo-1499951360447-b19be8fe80f5" alt="Logo" className="object-cover w-40 h-40 mb-8 rounded-full" />
            <h1 className="text-4xl font-bold mb-4">En Construcción</h1>
            <p className="text-lg mb-8 px-4 md:px-0">Estamos trabajando arduamente para traerte algo asombroso.</p>
            <div className="flex justify-center items-center space-x-4">
                <a href="#" className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md">Contáctanos</a>
            </div>
        </div>
    )
}