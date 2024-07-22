import { useEffect, useRef, useState } from 'react'
import OpenEyeIcon from '../icons/OpenEyeIncon'
import PlusIcon from '../icons/PlusIcon'
import { CommonLogic } from './ShareLogic'
import MiniXIcon from '../icons/MiniXIcon'
import ModalContainer from '../modal/ModalContainer'
import logger from '../../../logic/Logger/logger'

const common = new CommonLogic()

export function EyeButton({ onClick, children }) {
    return (
        <button
            type="button"
            onClick={(e) => {
                if (onClick) onClick(e)
            }}
            className="relative h-full w-9 border-gray-500 
        rounded-e-md bg-[#0A2F4E] flex items-center justify-center cursor-pointer transition-all duration-500  hover:bg-[#2286DD]"
        >
            <OpenEyeIcon width="w-5" heigth="h-5" />

            {children}
        </button>
    )
}

function AddButtonFloat({ onClick }) {
    return (
        <button
            type="button"
            onClick={(e) => {
                if (onClick) onClick(e)
            }}
            className="
        w-5 h-5  bg-[#0A2F4E] rounded-full flex items-center justify-center cursor-pointer transition-all duration-500  hover:bg-[#2286DD]"
        >
            <PlusIcon heigth="h-3" width="w-3" />
        </button>
    )
}

export function StoreItem({ item, onDelete, showDelete }) {
    return (
        <div
            className="relative bg-[#0A2F4E] text-[whitesmoke] py-2 px-8 
         border border-gray-500 shadow-lg rounded-full flex justify-center items-center"
        >
            <p className="text-sm">{item}</p>

            {showDelete && (
                <button
                    onClick={() => {
                        if (onDelete) onDelete(item)
                    }}
                    className="absolute w-5 h-5 top-1/2 right-1.5 transform -translate-y-1/2"
                >
                    <MiniXIcon color="#F43F5E" />
                </button>
            )}
        </div>
    )
}

export function StoreList({ items, onDelete, showDelete = true }) {
    return (
        <div className="w-full h-full flex flex-wrap justify-around space-x-1 space-y-1 ">
            {items &&
                items.map((v) => {
                    return (
                        <StoreItem
                            item={v}
                            key={v}
                            onDelete={onDelete}
                            showDelete={showDelete}
                        />
                    )
                })}
        </div>
    )
}

export default function AddInput({
    inputName,
    label,
    type = 'text',
    allowPattern = '^[A-Za-z0-9 ]*$',
    customValidator = null,
    useDotLabel = false,
    useStrongErrColor = false,
    placeHolder = '',
    items = [],
    setItems,
    mask,
}) {
    if (!inputName) inputName = label

    const inputRef = useRef(null)

    const [errMessage, setErrMessage] = useState('')

    const [showModal, setShowModal] = useState(false)
    const [controlValue, setControlValue] = useState('')

    const [errMessage, setErrMessage] = useState("");

    const [showModal, setShowModal] = useState(false);

    const [controlValue, setControlValue] = useState("");

    let itemsTotal = items?.length;

    if (itemsTotal > 9) {
        itemsTotal = `${9}+`
    }

    useEffect(() => {
        if (!mask) return

        const inputElement = document.getElementById(inputName)
        const imask = IMask(inputElement, mask)
        imask.updateValue()

        return () => imask.destroy()
    }, [])

    function addValue() {
        if (errMessage && errMessage.length > 0) return

        if (errMessage && errMessage.length > 0)
            return;


        //inputRef.current?.blur();

        // let value = inputRef.current?.value?.trim();

        if (!controlValue || controlValue.length == 0) {
            return;
        }

        logger.log('Anadiendo valor', controlValue)

        if (items?.includes(controlValue)) return

        if (!setItems) return

        setItems((currentItems) => {
            let newItems = [...currentItems, controlValue]

            return newItems
        })
        setControlValue('')
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter') {
            e.preventDefault()
            addValue()
            return
        }
        // if (!e.key.match(allowPattern)) {
        //     e.preventDefault();
        //     return;
        // }
    }

    function handleClickEyeButton() {
        if (items.length == 0) return

        setShowModal(true)
    }

    function handleOnChange(e) {
        setControlValue(e.currentTarget.value)

        // let value = inputRef.current?.value;

        setControlValue(e.target.value);

        // if (!controlValue.match(allowPattern)) {
        //     setErrMessage("El formato no es correcto")
        //     return;
        // }
        // if (customValidator) {
        //     let err = customValidator(value);
        //     if (err != null) {
        //         setErrMessage(err);
        //     }
        // }
        setErrMessage("");
    }

    function handleDeleteItem(item) {
        if (!setItems) return

        setItems((currentArray) => {
            let newArray = currentArray.filter((v) => v !== item)
            return newArray
        })
    }

    useEffect(() => {
        if (items.length == 0) {
            setShowModal(false)
        }
    }, [items])

    return (
        <div className={`group w-full relative flex flex-col justify-center`}>
            <label className={`block text-sm mb-2`} htmlFor={inputName}>
                {`${useDotLabel ? label + ':' : label}`}
            </label>

            <div className="flex">
                <div
                    className={`relative h-11 w-full  rounded-s-md shadow-sm flex
                             border-2  border-r-0
                             ${
                                 !common.isErr(errMessage, useStrongErrColor)
                                     ? CommonLogic.neutralColor
                                     : useStrongErrColor
                                       ? CommonLogic.errColor
                                       : CommonLogic.errSoftColor
                             }  
                             hover:border-3.5  hover:${common.borderColor(errMessage, useStrongErrColor)} 
                             has-[:focus]:border-3.5 has-[:focus]:${common.borderColor(errMessage, useStrongErrColor)} `}
                >
                    <input
                        className="w-full h-full outline-none p-2 my-auto border-0 bg-transparent"
                        ref={inputRef}
                        id={inputName}
                        type={type}
                        value={controlValue}
                        onChange={handleOnChange}
                        onKeyDown={handleKeyDown}
                        placeholder={placeHolder}
                        value={controlValue}

                    />
                    <div className="absolute top-1/2 right-1.5 transform -translate-y-1/2">
                        {
                            <AddButtonFloat
                                onClick={() => {
                                    addValue()
                                }}
                            />
                        }
                    </div>
                </div>
                <div className="relative">
                    <EyeButton onClick={handleClickEyeButton}>
                        {items.length > 0 && (
                            <p
                                className="absolute rounded-full h-[22px] w-[22px] z-1 p-2 text-sm -top-1 -right-3 
        text-[whitesmoke] bg-rose-500 flex items-center justify-center"
                            >
                                {itemsTotal}
                            </p>
                        )}
                    </EyeButton>
                </div>
            </div>

            {errMessage && errMessage?.length > 0 ? (
                <span
                    className={`text-xs font-light p-1 bg-transparent  
                ${useStrongErrColor ? 'text-rose-500' : 'text-slate-500'} `}
                >
                    {errMessage}
                </span>
            ) : null}

            <ModalContainer
                title={label}
                show={showModal}
                showX={true}
                onClose={() => {
                    setShowModal(false)
                }}
            >
                <StoreList
                    items={items}
                    onDelete={handleDeleteItem}
                ></StoreList>
            </ModalContainer>
        </div>
    )
}
