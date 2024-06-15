import LoginForm from "./Forms/LoginForm"  

export default function LoginPage({ }) {

    return (
      
      
      <div className="h-screen w-full bg-gray-200 flex flex-col justify-center">

            <div className="relative py-3 sm:max-w-xl sm:mx-auto">


                <div
                    className=" sm:absolute inset-0 bg-gradient-to-r from-[#036BD9] to-[#0069D9]
            shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-xl z-0">
                </div>

                
                <LoginForm/>

            </div>

        </div>
    )

}