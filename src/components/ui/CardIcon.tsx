import { AiOutlineExclamationCircle } from "react-icons/ai";


export default function CardIcon() {
    return (
        <>
            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-emerald-500 text-slate-500 group-[.is-active]:text-emerald-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
            <AiOutlineExclamationCircle />

            </div>

        </>
    )
}
