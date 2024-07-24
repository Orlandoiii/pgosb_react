import React from "react"

const proportion = 2.275862

export default function LinearDots({ height = 29, color = '#0069D9' }) {
    return (
        <svg
            viewBox="0 0 132 58"
            width={height * proportion}
            height={height}
            xmlns="http://www.w3.org/2000/svg"
        >
            <g
                id="Page-1"
                stroke="none"
                strokeWidth="1"
                fill={color}
                fillRule="evenodd"
            >
                <g id="dots">
                    <circle id="dot1" cx="25" cy="30" r="13" fill={color} />
                    <circle id="dot2" cx="65" cy="30" r="13" fill={color} />
                    <circle id="dot3" cx="105" cy="30" r="13" fill={color} />
                </g>
            </g>
        </svg>
    )
}
