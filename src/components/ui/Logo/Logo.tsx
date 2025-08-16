import Image from "next/image";
import logo from '../../../../public/champions/unmatched-logo-black-white.png';

export const Logo = () => {
    return (
        <Image src={logo} alt='unmatched-logo'/>
    )
}