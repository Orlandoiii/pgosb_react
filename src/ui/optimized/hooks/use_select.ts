import { useReducer, useRef, useEffect } from "react";
import { SelectOption } from "../components/inputs/select_options";

interface SelectState {
    innerSelectedOption: SelectOption
    preSelectedOption: SelectOption
    isHover: boolean,
    isFocus: boolean,
    isEmpty: boolean,
    optionsOpen: boolean,
    search: string,
}

interface SelectStoreState<T> {
    state: SelectState,
    config: {
        valueKey?: keyof T,
        displayKeys?: (keyof T)[],
        allowNewValue: boolean
    }
    options: {
        all: SelectOption[],
        filtered: SelectOption[],
    },
    refs: {
        selectContainer: React.RefObject<HTMLElement> | undefined,
        input: React.RefObject<HTMLInputElement> | undefined
    }
    refocus: boolean,
    ignoreFocus: boolean,
    optionChanged: ((option: string) => void) | undefined
}

type Action<T> =
    | { type: 'HOVER_IN' }
    | { type: 'HOVER_OUT' }
    | { type: 'FOCUS_IN' }
    | { type: 'FOCUS_OUT' }
    | { type: 'CLICKED' }
    | { type: 'CLICKED_OUT'; payload: React.MouseEvent<HTMLDivElement, MouseEvent> }
    | { type: 'CLEAR_CLICKED' }
    | { type: 'KEY_DOWN'; payload: React.KeyboardEvent<HTMLElement> }
    | { type: 'CHANGE_SEARCH'; payload: string }
    | { type: 'CHANGE_OPTIONS'; payload: T[] | string[] | undefined }
    | { type: 'CHANGE_SELECTED_OPTION'; payload?: SelectOption | string }



function getSelectOptions<T>(options: T[] | string[] | undefined, valueKey?: string, displayKeys?: string[]) {
    if (!options || options.length == 0 || options.some(x => x == undefined)) return [{ value: "", display: "Sin datos" }];
    console.log("options",options, valueKey);
    
    return options.map(option => {
        const value = typeof option === 'string' || !valueKey ? String(option) : String((option as Record<string, any>)[valueKey]);
        const display = typeof option === 'string' || !displayKeys
            ? String(option)
            : displayKeys.map(key => String((option as Record<string, unknown>)[key])).join(' - ');

        return { value, display };
    });
};
function getFilteredSelectOptions(options: SelectOption[], search: string) {
    if (!options || options.length == 0 || (options[0].value == '' && options[0].display == "Sin datos") || !search) return [{ value: "", display: "Sin datos" }];

    return options.filter(option =>
        option.display.toLowerCase().includes(search.toLowerCase())
    );
};
function getNewSelectedOption(options: SelectOption[], option: SelectOption | string, allowNewValue: boolean): SelectOption {
    let newOption: SelectOption;

    if (typeof option === 'string') {
        if (allowNewValue) return { value: option, display: option }
        else newOption = options.filter(x => x.display === option)[0]
    } else newOption = options.filter(x => x === option)[0]

    return newOption && (newOption.display != "Sin datos" && newOption.value != "") ? newOption : { value: "", display: "" }
}
function selectedOptionChangedHandler<T>(state: SelectStoreState<T>, option?: SelectOption | string): SelectStoreState<T> {
    let newPreSelectedOption = getNewSelectedOption(state.options.all, option ?? '', state.config.allowNewValue)
    const newSelectedOption = newPreSelectedOption.value == '' ? { value: "", display: "" } : newPreSelectedOption

    return ({
        ...state,
        state: {
            ...state.state,
            optionsOpen: false,
            search: "",
            innerSelectedOption: newSelectedOption.value == '' ? { value: "", display: "" } : newSelectedOption,
            preSelectedOption: newPreSelectedOption,
            isEmpty: newSelectedOption.value == '' && newSelectedOption.display == '',
        },
        options: { ...state.options, filtered: state.options.all },
        refocus: false, ignoreFocus: false
    })
}
function indexOfOption(options: SelectOption[], option: SelectOption): number {
    const foundOption = options.filter((item) => item.value == option.value && item.display == option.display)[0];
    if (foundOption) return options.indexOf(foundOption);
    return -1;
}

function getInitialState<T>(selectContainer: React.RefObject<HTMLElement>, input: React.RefObject<HTMLInputElement>, valueKey?: keyof T, displayKeys?: (keyof T)[], optionChanged?: (option: string) => void, allowNewValue?: boolean): SelectStoreState<T> {
    const SelectInitState: SelectState = {
        innerSelectedOption: { value: "", display: "" },
        preSelectedOption: { value: "", display: "" },
        isHover: false,
        isFocus: false,
        isEmpty: true,
        optionsOpen: false,
        search: "",
    };
    const ConfigInitState = {
        valueKey: valueKey,
        displayKeys: displayKeys,
        allowNewValue: allowNewValue
    }
    const OptionsInitState =
    {
        all: [],
        filtered: []
    }
    const RefsInitState =
    {
        selectContainer: selectContainer,
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
        case 'FOCUS_IN':
            if (state.ignoreFocus) return { ...state, ignoreFocus: false }
            else return ({ ...state, state: { ...state.state, optionsOpen: true, isFocus: true }, refocus: true, options: { ...state.options, filtered: state.options.all } });
        case 'FOCUS_OUT':
            if (state.refocus) {
                state.refs.input?.current ? state.refs.input.current.focus() : state.refs.selectContainer?.current?.focus()
                return { ...state, refocus: false, ignoreFocus: true }
            }
            return { ...state, state: { ...state.state, isFocus: false, optionsOpen: false }, refocus: false, ignoreFocus: false }
        case 'CLICKED':
            if (state.state.optionsOpen) return { ...state, state: { ...state.state, optionsOpen: false }, refocus: false, ignoreFocus: false }
            else return { ...state, state: { ...state.state, optionsOpen: true, isFocus: true }, refocus: true, ignoreFocus: true, options: { ...state.options, filtered: state.options.all } }
        case 'CLICKED_OUT':
            return { ...state, state: { ...state.state, optionsOpen: false, search: '' } };
        case 'CLEAR_CLICKED':
            return { ...state, state: { ...state.state, innerSelectedOption: { value: "", display: "" }, preSelectedOption: state.options.all.length > 0 ? state.options.all[0] : { value: "", display: "" }, isEmpty: true } }
        case 'KEY_DOWN':
            const key = action.payload.key.toLowerCase()

            if (key === "tab")
                return { ...state, state: { ...state.state, isFocus: false, optionsOpen: false, search: "" }, refocus: false, ignoreFocus: false }

            if (key === "escape")
                return { ...state, state: { ...state.state, optionsOpen: false, search: "" }, refocus: false, ignoreFocus: false }

            if (key === "enter" || key === " ") {
                action.payload.stopPropagation();
                action.payload.preventDefault();

                if (key === "enter") {
                    if (state.state.optionsOpen) {
                        if (state.config.allowNewValue) {
                            if (state.options.filtered.length > 0 && state.options.filtered[0].value != '' && state.options.filtered[0].display != 'Sin datos') {
                                return { ...state, state: { ...state.state, innerSelectedOption: state.state.preSelectedOption, optionsOpen: false, search: "", isEmpty: state.state.preSelectedOption.value == '' }, refocus: false, ignoreFocus: false }
                            }
                            else return { ...state, state: { ...state.state, innerSelectedOption: { value: state.state.search, display: state.state.search }, optionsOpen: false, search: "", isEmpty: state.state.search == '' }, refocus: false, ignoreFocus: false }
                        } else {
                            if (state.state.preSelectedOption.value != '') return { ...state, state: { ...state.state, innerSelectedOption: state.state.preSelectedOption, optionsOpen: false, search: "", isEmpty: state.state.preSelectedOption.value == '' }, refocus: false, ignoreFocus: false }
                            else return { ...state, state: { ...state.state, preSelectedOption: state.state.innerSelectedOption.value != '' ? state.state.innerSelectedOption : state.state.preSelectedOption, optionsOpen: false, search: "", isEmpty: state.state.innerSelectedOption.value != '' ? (state.state.innerSelectedOption.value == "") : (state.state.preSelectedOption.value == "") }, refocus: false, ignoreFocus: false }
                        }
                    }
                    else return { ...state, state: { ...state.state, optionsOpen: true, isFocus: true }, refocus: true, ignoreFocus: true, options: { ...state.options, filtered: state.options.all } }
                }
                else {
                    const newSearch = state.state.search + " "
                    const newFilteredoptions = newSearch != '' ? getFilteredSelectOptions(state.options.all, newSearch) : state.options.all
                    const newPreSelectedOption = newFilteredoptions.length > 0 ? newFilteredoptions[0] : { value: '', display: '' }

                    return { ...state, state: { ...state.state, optionsOpen: true, isFocus: true, search: newSearch, preSelectedOption: newPreSelectedOption }, refocus: true, ignoreFocus: true, options: { ...state.options, filtered: newFilteredoptions } }
                }
            }

            if (key.toLowerCase().includes("arrow")) {
                const preSelectedIndex = indexOfOption(state.options.filtered, state.state.preSelectedOption)

                if ((key.includes("up") && preSelectedIndex <= 0) || (key.includes("down") && preSelectedIndex >= state.options.filtered.length - 1)) return state

                if (key.includes("up")) return { ...state, state: { ...state.state, preSelectedOption: state.options.filtered[preSelectedIndex - 1] } }
                if (key.includes("down")) return { ...state, state: { ...state.state, preSelectedOption: state.options.filtered[preSelectedIndex + 1] } }
            }

            return state
        case 'CHANGE_SEARCH':
            if (action.payload == '') {
                return {
                    ...state,
                    state: { ...state.state, search: action.payload, preSelectedOption: state.options.all[0] },
                    options: { ...state.options, filtered: state.options.all }
                }
            }

            const newFilteredoptions = getFilteredSelectOptions(state.options.all, action.payload)
            const newPreSelectedOption = newFilteredoptions.length > 0 ? newFilteredoptions[0] : { value: '', display: '' }

            return {
                ...state,
                state: { ...state.state, search: action.payload, preSelectedOption: newPreSelectedOption },
                options: { ...state.options, filtered: newFilteredoptions }
            }
        case 'CHANGE_OPTIONS':
            const newOptions = getSelectOptions(action.payload, state.config.valueKey as string | undefined, state.config.displayKeys as string[] | undefined)

            const selectedOption = newOptions.includes(state.state.innerSelectedOption) ? state.state.innerSelectedOption : { value: '', display: '' }
            const empty = selectedOption.value == '' && selectedOption.display == ''

            return ({
                ...state,
                state: { ...state.state, innerSelectedOption: selectedOption, preSelectedOption: selectedOption, isEmpty: empty, search: '' },
                options: {
                    all: newOptions,
                    filtered: newOptions
                }
            })
        case 'CHANGE_SELECTED_OPTION':
            return selectedOptionChangedHandler(state, action.payload)
        default:
            return state;
    }
}

export function useSelect<T>(options: T[] | string[] | undefined, selectedOption: string, valueKey?: keyof T, displayKeys?: (keyof T)[], optionChanged?: (option: string) => void, isLoading?: boolean, allowNewValue?: boolean): { state: SelectStoreState<T>, dispatch: React.Dispatch<Action<T>> } {
    const containerRef = useRef<HTMLElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const [state, dispatch] = useReducer(reducer<T>, getInitialState<T>(containerRef, inputRef, valueKey, displayKeys, optionChanged, allowNewValue))

    useEffect(() => {
        dispatch({ type: 'CHANGE_OPTIONS', payload: options })
        dispatch({ type: 'CHANGE_SELECTED_OPTION', payload: selectedOption })
    }, [options])

    useEffect(() => {

        if (selectedOption != state.state.innerSelectedOption.value && !isLoading) {
            optionChanged?.(state.state.innerSelectedOption.value)
        }
    }, [state.state.innerSelectedOption])

    return {
        state,
        dispatch
    };
}