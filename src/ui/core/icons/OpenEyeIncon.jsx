export default function OpenEyeIcon({ width = 'w-4', heigth = 'h-4' }) {

    return (
        <svg className={`${width} ${heigth}`} fill="#FFFFFF" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
            <g stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1">
                <path d="m1 12s4-8 11-8 11 8 11 8" />
                <path d="m1 12s4 8 11 8 11-8 11-8" />
                <circle cx="12" cy="12" r="3" />
            </g>
        </svg>
    )
}
