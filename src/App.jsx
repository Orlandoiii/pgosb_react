import MainLayout from './ui/components/Layouts/MainLayout'




function App() {

    console.log(testJson);

    let testParse = JSON.parse(testJson);

    console.log(testParse);


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
