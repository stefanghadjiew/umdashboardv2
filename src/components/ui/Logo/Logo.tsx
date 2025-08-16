import Image from "next/image";
import { resources } from "../../../../public/champions";

export const Logo = () => {
    return (
        <Image src={resources.unmatched_logo_black_white} alt='unmatched-logo'/>
    )
}