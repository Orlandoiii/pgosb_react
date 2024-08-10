import React from 'react'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import logger from '../../../logic/Logger/logger'
import { useConfig } from './ConfigContext'

class LayoutData {
    layout: any
    groupDefinition: any
    fieldDefinition: any
    visibleGroups: any

    constructor() {
        this.layout = null
        this.groupDefinition = {}
        this.fieldDefinition = {}
        this.visibleGroups = [{}]
    }
}

const LayoutContex = createContext(new LayoutData())

let renderCounter = 0

export default function LayoutContexProvider({ layoutName, children }) {
    renderCounter++

    logger.log('Renderizo ContextLayout', renderCounter)

    const { config } = useConfig()

    const layoutConfig = config[layoutName]
    logger.log(layoutName, layoutConfig)

    const groupDefinition = useMemo(() => {
        if (!layoutConfig) return null

        return layoutConfig.reduce((acc, obj) => {
            const group = obj.group_name
            const isVisible = obj.visibility

            acc[group] ||= { fields: [], visibleCount: 0 }

            acc[group].fields.push({ [obj.column_name]: obj.display_name })

            if (isVisible) {
                acc[group].visibleCount++
            }

            return acc
        }, {})
    }, [layoutConfig])

    const fieldDefinition = useMemo(() => {
        if (!layoutConfig) return null

        const dict = new Map()

        layoutConfig.forEach((v) => {
            dict.set(v.column_name, v)
        })

        return dict
    }, [layoutConfig])

    const visibleGroups = useMemo(() => {
        return Object.keys(groupDefinition)
            .filter((key) => groupDefinition[key].visibleCount > 0)
            .reduce((obj, key) => {
                obj[key] = groupDefinition[key]
                return obj
            }, {})
    }, [groupDefinition])

    logger.log(
        'Layouts COMPLETED',
        layoutConfig,
        groupDefinition,
        fieldDefinition
    )

    const layoutIsLoaded = layoutConfig && groupDefinition && fieldDefinition

    return (
        <LayoutContex.Provider
            value={{
                layout: layoutConfig,
                groupDefinition: groupDefinition,
                fieldDefinition: fieldDefinition,
                visibleGroups: visibleGroups,
            }}
        >
            {layoutIsLoaded && children}
        </LayoutContex.Provider>
    )
}

export function useLayout() {
    return useContext(LayoutContex)
}
