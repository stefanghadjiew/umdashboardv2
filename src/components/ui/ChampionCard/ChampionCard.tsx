import { resources } from "../../../../public/champions";

interface IChampionCard {
    name: string;
    onClick: () => void;
    className?: string;
}

export const ChampionCard = ({name, onClick, className} : IChampionCard) => {
    const image = resources[name] ?? '';
    const componentClasses = `inline-block h-[200px] w-[120px] bg-cover bg-center cursor-pointer text-red ${className}`;
    return (
        <div onClick={() => onClick()} className={componentClasses} style={{ backgroundImage: `url(${image})` }}>{name}</div>
    )
}