import MainLayout from './ui/components/Layouts/MainLayout'

function App() {

    return (
        <>
            <div className="bg-[#F1F5F9]">
                <div className='max-w-[1900px]'>
                    <MainLayout />
                </div>
            </div>
            <div id="modal-root"></div>
        </>
    )
}

export default App
