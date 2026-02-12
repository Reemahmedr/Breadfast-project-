import { useQuery } from '@tanstack/react-query'
import { getAddress } from '../app/apis-actions/address/address'

export default function Address_Show() {
    const { data: getAddressData = [] } = useQuery({
        queryKey: ["getAddress"],
        queryFn: getAddress
    })
    return (
        <>
            {getAddressData.length === 0 && <p>Add address</p>}
            {getAddressData?.map((address: any) => (
                <div className=' capitalize'>
                    {address.is_default && <p>{address.street_address} - {address.area} </p>}
                </div>
            ))}
        </>
    )
}
