import React from "react"

export default function PlusIcon({ width = 'w-4', heigth = 'h-4' }) {
    return (
        <svg className={`${width} ${heigth}`} viewBox='0 0 10 10' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path d='M1.22229 5.00019H8.77785M5.00007 8.77797V1.22241'
                stroke='white' strokeWidth='1.6'
                strokeLinecap='round'
                strokeLinejoin='round'></path>
        </svg>
    )
}