import { useReducer, useRef, useEffect } from "react";
import SelectOptions, { SelectOption, SelectOptionsMethods } from "../components/inputs/select_options";
import { modalService } from "../../core/overlay/overlay_service";
import { OverlayModalConfig } from "../../core/overlay/models/overlay_item";

interface SelectState {
    innerSelectedOption: SelectOption
    isHover: boolean,
    isFocus: boolean,
    isEmpty: boolean,
    optionsOpen: boolean,
    search: string,
    closeOptionsModal: (() => void) | null | undefined,
    sameOption: number,
}

interface SelectStoreState<T> {
    state: SelectState,
    config: {
        valueKey?: keyof T,
        displayKeys?: (keyof T)[],
        allowNewValue: boolean,
        clearAfterSelect: boolean
    }
    options: {
        all: SelectOption[],
        filtered: SelectOption[],
    },
    refs: {
        selectContainer: React.RefObject<HTMLElement> | undefined,
        selectOptions: React.MutableRefObject<SelectOptionsMethods | undefined> | undefined,
        input: React.RefObject<HTMLInputElement> | undefined
    }
    refocus: boolean,
    ignoreFocus: boolean,
    optionChanged: ((option: string) => void) | undefined
}

type Action<T> =
    | { type: 'HOVER_IN' }
    | { type: 'HOVER_OUT' }
    | { type: 'FOCUS_IN_OR_CLICKED' }
    | { type: 'FOCUS_OUT' }
    | { type: 'CLEAR_CLICKED' }
    | { type: 'OPTIONS_CLOSED' }
    | { type: 'KEY_DOWN'; payload: React.KeyboardEvent<HTMLElement> }
    | { type: 'CHANGE_CLOSE_CALL'; payload: (() => void) | null }
    | { type: 'CHANGE_SEARCH'; payload: string }
    | { type: 'CHANGE_OPTIONS'; payload: T[] | string[] | undefined }
    | { type: 'CHANGE_SELECTED_OPTION'; payload: SelectOption | string }
    | { type: 'CHANGE_SELECTED_OPTION_FROM_FATHER'; payload: SelectOption | string }



function getSelectOptions<T>(options: T[] | string[] | undefined, valueKey?: string, displayKeys?: string[]) {
    if (!options || options.length == 0) return [{ value: "", display: "Sin datos" }];
    return options.map(option => {
        const value = typeof option === 'string' || !valueKey ? String(option) : String((option as Record<string, unknown>)[valueKey]);
        const display = typeof option === 'string' || !displayKeys
            ? String(option)
            : displayKeys.map(key => String((option as Record<string, unknown>)[key])).join(' - ');

        return { value, display };
    });
};
function getFilteredSelectOptions(options: SelectOption[], search: string) {
    if (!search) return options;
    return options.filter(option =>
        option.display.toLowerCase().includes(search.toLowerCase())
    );
};
function getNewSelectedOption(options: SelectOption[], option: SelectOption | string, allowNewValue: boolean): SelectOption {
    let newOption: SelectOption;


    if (typeof option === 'string') {
        if (allowNewValue) newOption = { value: option, display: option }
        else newOption = options.filter(x => x.display === option)[0]
    } else {
        if (allowNewValue) newOption = { value: option.value, display: option.value }
        else newOption = options.filter(x => x.value === option.value)[0]
    }
    return newOption && (newOption.display != "Sin datos" && newOption.value != "") ? newOption : { value: "", display: "" }
}
function onClickOrFocusHandler(options: SelectOption[], selectedOption: SelectOption, selectContainer: React.RefObject<HTMLElement>, selectOptions: React.MutableRefObject<SelectOptionsMethods | undefined>, onSelectedOptionChanged: (option: SelectOption) => void, onClose: (clickedOut: boolean) => void): (() => void) | null {
    if (selectContainer?.current && selectOptions) {
        const { closeModal } = modalService.pushModal(
            SelectOptions,
            {
                options: options,
                selectedOption: selectedOption,
                relativeContainer: selectContainer.current as any,
                onSelect: onSelectedOptionChanged,
                ref: selectOptions,
            },
            new OverlayModalConfig("Modal", "", "None", true),

            () => onClose(false),
            () => onClose(true)
        );

        return closeModal
    }
    else return null
};
function selectedOptionChangedHandler<T>(state: SelectStoreState<T>, option: SelectOption | string): SelectStoreState<T> {
    const newSelectedOption = getNewSelectedOption(state.options.all, option, state.config.allowNewValue)

    return ({
        ...state,
        state: {
            ...state.state,
            search: "",
            innerSelectedOption: newSelectedOption,
            isEmpty: newSelectedOption.value == '' && newSelectedOption.display == '',
            sameOption: state.state.innerSelectedOption == newSelectedOption ? state.state.sameOption + 1 : 0
        },
        options: { ...state.options, filtered: getFilteredSelectOptions(state.options.all, "") }
    })
}


function getInitialState<T>(selectContainer: React.RefObject<HTMLElement>, selectOptions: React.MutableRefObject<SelectOptionsMethods | undefined>, input: React.RefObject<HTMLInputElement>, valueKey?: keyof T, displayKeys?: (keyof T)[], optionChanged?: (option: string) => void, allowNewValue?: boolean, clearAfterSelect?: boolean): SelectStoreState<T> {
    const SelectInitState: SelectState = {
        innerSelectedOption: { value: "", display: "" },
        isHover: false,
        isFocus: false,
        isEmpty: true,
        optionsOpen: false,
        search: "",
        closeOptionsModal: undefined,
        sameOption: 0,
    };
    const ConfigInitState = {
        valueKey: valueKey,
        displayKeys: displayKeys,
        allowNewValue: allowNewValue,
        clearAfterSelect: clearAfterSelect
    }
    const OptionsInitState =
    {
        all: [],
        filtered: []
    }
    const RefsInitState =
    {
        selectContainer: selectContainer,
        selectOptions: selectOptions,
        input: input
    }

    return {
        state: SelectInitState,
        config: ConfigInitState as any,
        options: OptionsInitState,
        refs: RefsInitState,
        refocus: false,
        ignoreFocus: false,
        optionChanged: optionChanged
    }
}
function reducer<T>(state: SelectStoreState<T>, action: Action<T>): SelectStoreState<T> {
    switch (action.type) {
        case 'HOVER_IN':
            return { ...state, state: { ...state.state, isHover: true } };
        case 'HOVER_OUT':
            return { ...state, state: { ...state.state, isHover: false } };
        case 'FOCUS_IN_OR_CLICKED':

            if (state.refs.selectContainer && state.refs.selectOptions) {
                if (state.ignoreFocus) return { ...state, ignoreFocus: false }
                else return ({ ...state, state: { ...state.state, optionsOpen: true, isFocus: true }, refocus: true });
            }
            else {
                console.error(`The options could not be open because => ContainerRef: ${state.refs.selectContainer}, OptionsRef: ${state.refs.selectOptions}`);
                return state
            }
        case 'FOCUS_OUT':
            if (state.refocus) {
                state.refs.input?.current ? state.refs.input.current.focus() : state.refs.selectContainer?.current?.focus()
                return { ...state, refocus: false, ignoreFocus: true }
            }
            if (state.refs.input?.current && state.state.isFocus) state.refs.input.current.blur()
            return { ...state, state: { ...state.state, isFocus: false, optionsOpen: false, closeOptionsModal: null }, refocus: false, ignoreFocus: false }
        case 'CLEAR_CLICKED':
            return { ...state, state: { ...state.state, innerSelectedOption: { value: "", display: "" }, isEmpty: true } }
        case 'KEY_DOWN':
            if (action.payload.key.toLowerCase() === "tab") {
                state.state.closeOptionsModal?.()
                return { ...state, refocus: false }
            }

            if (action.payload.key.toLowerCase() === "enter") {
                action.payload.stopPropagation();
                action.payload.preventDefault();
            }

            if (action.payload.key.toLowerCase() === "escape" && state.state.closeOptionsModal) {
                state.state.closeOptionsModal()
                return { ...state, state: { ...state.state, optionsOpen: false, closeOptionsModal: null }, refocus: false }
            }

            if (state.refs.input?.current && !state.state.optionsOpen) {
                action.payload.stopPropagation();
                action.payload.preventDefault();
                return ({ ...state, state: { ...state.state, optionsOpen: true, isFocus: true }, refocus: true });
            }

            if (!state.state.optionsOpen || !state.refs.selectOptions || !state.refs.selectOptions.current) return { ...state, refocus: state.state.optionsOpen };

            state.refs.selectOptions.current.keyDownHandler(action.payload);

            return { ...state, refocus: state.state.optionsOpen }
        case 'CHANGE_CLOSE_CALL':
            return { ...state, state: { ...state.state, closeOptionsModal: action.payload } }
        case 'CHANGE_SEARCH':
            const temp = state.config.allowNewValue ? { value: state.state.search, display: state.state.search } : state.state.innerSelectedOption
            
            return {
                ...state,
                state: { ...state.state, search: action.payload },
                options: { ...state.options, filtered: getFilteredSelectOptions(state.options.all, action.payload) }
            }
        case 'CHANGE_OPTIONS':
            const newOptions = getSelectOptions(action.payload, state.config.valueKey as string | undefined, state.config.displayKeys as string[] | undefined)
            const newFilteredOptions = getFilteredSelectOptions(newOptions, state.state.search)

            const selectedOption = newOptions.includes(state.state.innerSelectedOption) ? state.state.innerSelectedOption : { value: '', display: '' }
            const empty = selectedOption.value == "" && selectedOption.display == ''

            return ({
                ...state,
                state: {
                    ...state.state,
                    innerSelectedOption: selectedOption,
                    isEmpty: empty,
                    sameOption: state.state.innerSelectedOption == selectedOption ? state.state.sameOption + 1 : 0
                },
                options: {
                    all: newOptions,
                    filtered: newFilteredOptions
                }
            })
        case 'OPTIONS_CLOSED':
            return {
                ...state, state: {
                    ...state.state,
                    optionsOpen: false,
                    closeOptionsModal: null,
                }
            }
        case 'CHANGE_SELECTED_OPTION':
            return selectedOptionChangedHandler(state, action.payload)
        case 'CHANGE_SELECTED_OPTION_FROM_FATHER':
            return selectedOptionChangedHandler(state, action.payload)
        default:
            return state;
    }
}
export function useSelect<T>(options: T[] | string[] | undefined, selectedOption: string, valueKey?: keyof T, displayKeys?: (keyof T)[], optionChanged?: (option: string) => void, isLoading?: boolean, allowNewValue?: boolean, clearAfterSelect?: boolean): { state: SelectStoreState<T>, dispatch: React.Dispatch<Action<T>> } {
    const containerRef = useRef<HTMLElement>(null);
    const optionsRef = useRef<SelectOptionsMethods>();
    const inputRef = useRef<HTMLInputElement>(null);

    const [state, dispatch] = useReducer(reducer<T>, getInitialState<T>(containerRef, optionsRef, inputRef, valueKey, displayKeys, optionChanged, allowNewValue, clearAfterSelect))

    useEffect(() => {
        if (state.state.optionsOpen && state.refs.selectContainer && state.refs.selectOptions && !state.state.closeOptionsModal) {
            const closeModal = onClickOrFocusHandler(state.options.all, state.state.innerSelectedOption, containerRef, optionsRef, (option: SelectOption) => { dispatch({ type: 'CHANGE_SELECTED_OPTION', payload: option }) }, () => { dispatch({ type: 'FOCUS_OUT' }) });
            if (closeModal) {
                dispatch({ type: 'CHANGE_CLOSE_CALL', payload: closeModal })
            }
        }
    }, [state.state.optionsOpen]);

    useEffect(() => {
        dispatch({ type: 'CHANGE_OPTIONS', payload: options })
    }, [options])

    useEffect(() => {
        console.log(state.options.all, selectedOption, isLoading);
        
        if (!isLoading && state.options.all.length > 0 && state.options.all[0].display != 'Sin datos') {
            const option = state.options.all.filter(x => x.value == selectedOption)[0] ?? { value: '', display: '' }
            console.log(selectedOption,option, state.state.innerSelectedOption);
            if (option.value != state.state.innerSelectedOption.value) {
                dispatch({ type: 'CHANGE_SELECTED_OPTION_FROM_FATHER', payload: option })
            }
        }
    }, [state.options.all, selectedOption, isLoading])

    useEffect(() => {
        if (state.config.clearAfterSelect && state.state.innerSelectedOption.value == '') return

        if (!isLoading && state.options.all.length > 0 && state.options.all[0].display != 'Sin datos' && state.state.innerSelectedOption.display != '' && state.state.innerSelectedOption.value != '') {
            if (state.state.optionsOpen) {
                state.state.closeOptionsModal?.()
                dispatch({ type: 'OPTIONS_CLOSED' })
            }
            state.optionChanged?.(state.state.innerSelectedOption.value)
            if (state.config.clearAfterSelect) dispatch({ type: 'CHANGE_SELECTED_OPTION', payload: "" })
        }
    }, [state.state.innerSelectedOption, state.state.sameOption])

    useEffect(() => {
        if (state.state.optionsOpen) state.refs.selectOptions?.current?.filterOptions(state.state.search, state.options.filtered)
    }, [state.options.filtered, state.state.search])

    return {
        state,
        dispatch
    };
}