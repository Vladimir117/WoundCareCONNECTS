import React from 'react'
import { doctor } from 'src/assets'
import { servicesAndTreatments } from 'src/constants'
import styles from 'src/style'

const ServicesAndTreatments = () => {
  return (
    <section id='serviceTreatment' className={`wc-card rounded-[20px] px-5 sm:px-10`}>
        <h2 className={`text-[32px] sm:text-[40px] font-manrope font-semibold text-black text-center py-[30px]`}><span className='text-gradient'>Services and Treatments </span>Offered</h2>
        <div className='sm:flex justify-between'>
            <div className='flex justify-center items-center pb-10 pl-5'>
                <ul className='list-disc text-[18px] ss:text-[26px] leading-[40px] md:leading-[50px] lg:leading-[60px] wc-ul'>
                    {servicesAndTreatments.map((item) => (
                        <li key={item.id}>{item.content}</li>
                    ))}
                </ul>
            </div>  
            <div className='md:flex items-end'>
                <img src={doctor} alt='Get to know us' className='w-[100%]' />
            </div>
        </div>
    </section>
  )
}

export default ServicesAndTreatments
