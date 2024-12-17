import React, { useCallback, useEffect, useState } from 'react'
import ModalLayout from '../../../optimized/components/layouts/modal_layout.tsx'
import { AddableTable } from '../../Temp/AddableTable.tsx'
import TextInput from '../../../alter/components/inputs/text_input.tsx'
import LoadingModal from '../../../core/modal/LoadingModal.tsx'
import { useActionModalAndCollection } from '../../../core/hooks/useActionModalAndCollection.ts'
import { AuthorityPersonForm } from './AuthorityPersonForm.tsx'
import { AuthorityVehicleForm } from './AuthorityVehicleForm.tsx'
import { modalService } from '../../../core/overlay/overlay_service.tsx'
import { SelectWithSearch } from '../../../alter/components/inputs/select_with_search.tsx'
import { getAll } from '../../../../services/http.tsx'
import { MissionAuthorityFront } from '../../../../domain/models/mission/authority/mission_authority.ts'
import { useMissionAuthorityActions } from '../../../../domain/models/mission/authority/use_collection.ts'
import { useMissionAuthorityPersonCollection } from '../../../../domain/models/mission/authority_person/use_collection.ts'
import { useMissionAuthorityVehicleCollection } from '../../../../domain/models/mission/authority_vehicle/use_collection.ts'
import { MissionAuthorityPersonFront, MissionAuthorityPersonNameConverter } from '../../../../domain/models/mission/authority_person/mission_authority_person.ts'
import { MissionAuthorityVehicleFront, MissionAuthorityVehicleNameConverter } from '../../../../domain/models/mission/authority_vehicle/mission_authority_vehicle.ts'


interface AutorityFormProps {
    initValue: MissionAuthorityFront | undefined
    closeOverlay?: () => void
}

export function AuthorityForm({
    initValue,
    closeOverlay,
}: AutorityFormProps) {
    const [authorityPeople, authorityPeopleActions, updateAuthorityPerson] = useMissionAuthorityPersonCollection(initValue?.id ?? '')
    const [authorityPersonModalData, setAuthorityPersonModalData] = useState<MissionAuthorityPersonFront>()
    const [authorityPersonModalOpen, setAuthorityPersonModalOpen] = useState(false)

    const [authorityVehicles, authorityVehiclesActions, updateAuthorityVehicle] = useMissionAuthorityVehicleCollection(initValue?.id ?? '')
    const [authorityVehicleModalData, setAuthorityVehicleModalData] = useState<MissionAuthorityVehicleFront>()
    const [authorityVehicleModalOpen, setAuthorityVehicleModalOpen] = useState(false)

    const [action, setAction] = useState<'add' | 'update' | undefined>(undefined);

    const authorityActions = useMissionAuthorityActions();
    const [isVisible, setIsVisible] = useState(true)
    const [loading, setLoading] = useState(false)

    const [alias, setAlias] = useState(initValue ? initValue.alias : '')
    const [type, setType] = useState(initValue ? initValue.institutionId : '')
    const [typesCollection, setTypesCollection] = useState<{ id: string, name: string, abbreviation: string, government: string }[]>([])

    useEffect(() => {
        getAuthorityTypes()
    }, [])

    const getAuthorityTypes = useCallback(async () => {
        const response = await getAll<{ id: string, name: string, abbreviation: string, government: string }>(
            'authority'
        )
        if (response.success && response.result)
            return setTypesCollection(response.result)
        else return setTypesCollection([])
    }, [])

    async function updateService() {
        const authorityResult = await authorityActions.getById(initValue!.id)

        if (
            authorityResult.success &&
            authorityResult.result &&
            (authorityResult.result?.alias != alias || authorityResult.result?.institutionId != type)
        ) {
            authorityResult.result.alias = alias
            authorityResult.result.institutionId = type
            const updateResult = await authorityActions.updateFront(authorityResult.result)

            if (updateResult.success)
                modalService.toastSuccess('Autoridad actualizada!')
            else modalService.toastError('No se pudo actualizar la autoridad!')
        }
    }

    useEffect(() => {
        updateService()
    }, [type])

    console.log();


    return (
        <>
            <ModalLayout
                title={'Registro de Autoridad'}
                isVisible={isVisible}
                onClosed={closeOverlay}
                className="min-w-[70vw]"
                onClose={() => {
                    setIsVisible(false)
                }}
            >
                <div className="flex justify-between w-full">
                    <div className="flex items-center space-x-4">
                        <div className="font-semibold text-slate-700 text-xl">
                            Alias:
                        </div>
                        <TextInput
                            value={alias}
                            onChange={(e) => setAlias(e.currentTarget.value)}
                            onBlur={updateService}
                        ></TextInput>
                    </div>

                    <div className=" w-2/3">
                        <SelectWithSearch
                            description="Tipo"
                            options={typesCollection}
                            selectedOption={type}
                            selectionChange={(e) => setType(e)}
                            valueKey={'id'}
                            displayKeys={['abbreviation', 'name']}
                        />
                    </div>
                </div>

                <div className="h-8"></div>

                <AddableTable
                    title="Vehiculos"
                    data={authorityVehicles ?? []}
                    defaultSort={'id'}
                    idPropertyName="id"
                    addButtonText="Agregar un vehículo"
                    nameConverter={MissionAuthorityVehicleNameConverter}
                    onAddButtonClick={() => {
                        setAuthorityVehicleModalOpen(true)
                        setAction('add')
                    }}
                    onEditButtonClick={async (id) => {
                        const authorityVehicle = await authorityVehiclesActions.getById(id)
                        if (authorityVehicle.success && authorityVehicle.result) {
                            setAuthorityVehicleModalData(authorityVehicle.result)
                            setAuthorityVehicleModalOpen(true)
                            setAction('update')
                        }
                    }}
                    onDeleteButtonClick={async (id) => {
                        let result = await authorityVehiclesActions.remove(id)
                        if (result.success) updateAuthorityVehicle()
                    }}
                ></AddableTable>

                <div className="h-8"></div>

                <AddableTable
                    title="Funcionarios"
                    data={authorityPeople ?? []}
                    defaultSort={'id'}
                    idPropertyName="id"
                    addButtonText="Agregar un funcionario"
                    nameConverter={MissionAuthorityPersonNameConverter}
                    onAddButtonClick={() => {
                        setAuthorityPersonModalOpen(true)
                        setAction('add')
                    }}
                    onEditButtonClick={async (id) => {
                        const authorityPerson = await authorityPeopleActions.getById(id)
                        if (authorityPerson.success && authorityPerson.result) {
                            setAuthorityPersonModalData(authorityPerson.result)
                            setAuthorityPersonModalOpen(true)
                            setAction('update')
                        }
                    }}
                    onDeleteButtonClick={async (id) => {
                        let result = await authorityPeopleActions.remove(id)
                        if (result.success) updateAuthorityPerson()
                    }}
                ></AddableTable>
            </ModalLayout>
            <LoadingModal initOpen={loading} children={null} />

            {authorityPersonModalOpen &&
                <AuthorityPersonForm
                    initValue={action == "add" ? { authorityId: initValue!.id, missionId: initValue!.missionId } : { ...authorityPersonModalData, authorityId: initValue!.id, missionId: initValue!.id } as any}
                    add={action == "add"}
                    closeOverlay={() => {
                        updateAuthorityPerson()
                        setAuthorityPersonModalOpen(false)
                    }
                    } />}

            {authorityVehicleModalOpen &&
                <AuthorityVehicleForm
                    initValue={action == "add" ? { authorityId: initValue!.id, missionId: initValue!.missionId } : { ...authorityVehicleModalData, authorityId: initValue!.id, missionId: initValue!.id } as any}
                    add={action == "add"}
                    closeOverlay={() => {
                        updateAuthorityVehicle()
                        setAuthorityVehicleModalOpen(false)
                    }
                    } />}
        </>
    )
}