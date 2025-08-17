import { resources } from "../../../../public/champions";

interface IChampionCard {
    name: string;
    onClick: () => void;
    className?: string;
}

export const ChampionCard = ({name, onClick, className} : IChampionCard) => {
    const image = resources[name] ?? '';
    const componentClasses = `flex justify-center items-end h-[200px] w-[155px] bg-cover bg-center cursor-pointer text-white ${className}`;
    return (
        <div onClick={() => onClick()} className={componentClasses} style={{ backgroundImage: `url(${image})` }}><span className="font-bold text-xl">{name}</span></div>
    )
}