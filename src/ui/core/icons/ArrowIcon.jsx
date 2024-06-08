export default  function ArrowIcon({ active = false }) {
    return (
        <svg

            className={`w-[22px] h-[22px] ${!active ? 'fill-gray-400 rotate-0' : 'fill-[#3C50E0] rotate-180'} hover:fill-[#3C50E0] 
            transition-transform duration-200 ease-in-out`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 80 80" >
            <path
                className="st0"
                d="M61.33,37.48L43.72,55.09c-2.08,2.08-5.45,2.08-7.52,0l-3.46-3.46L18.58,37.48c-2-1.99-2-5.23,0-7.22l0,0
         c1.99-1.99,5.23-1.99,7.22,0L39.96,44.4l14.15-14.15c2-1.99,5.23-1.99,7.22,0l0,0C63.33,32.25,63.33,35.48,61.33,37.48z"
            />
        </svg>
    )
}
