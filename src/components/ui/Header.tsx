
export default function Header() {
    return (
        <>
            <div className="max-w-4xl px-10 my-4 py-6 bg-white rounded-lg shadow-md">
                <div className="flex justify-between items-center">
                    <span className="font-light text-gray-600">mar 10, 2019</span>
                    <a className="px-2 py-1 bg-gray-600 text-gray-100 font-bold rounded hover:bg-gray-500" href="#">Design</a>
                </div>
                <div className="mt-2">
                    <a className="text-2xl text-gray-700 font-bold hover:text-gray-600" href="#">Accessibility tools for designers and developers</a>
                    <p className="mt-2 text-gray-600">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Tempora expedita dicta totam aspernatur doloremque. Excepturi iste iusto eos enim reprehenderit nisi, accusamus delectus nihil quis facere in modi ratione libero!</p>
                </div>
                <div className="flex justify-between items-center mt-4">
                    <a className="text-blue-600 hover:underline" href="#">Read more</a>
                    <div>
                        <a className="flex items-center" href="#">
                            <img className="mx-4 w-10 h-10 object-cover rounded-full hidden sm:block" src="https://images.unsplash.com/photo-1502980426475-b83966705988?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=373&q=80" alt="avatar" />
                            <h1 className="text-gray-700 font-bold">Khatab wedaa</h1>
                        </a>
                    </div>
                </div>
            </div>
        </>
    )
}
