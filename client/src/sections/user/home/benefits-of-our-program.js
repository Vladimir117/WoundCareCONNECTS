import React from 'react'
import { customerAndDoctor } from 'src/assets'
import { benefitsOfOurProgram } from 'src/constants'
import styles, { layout } from 'src/style'

const BenefitsOfOurProgram = () => {
  return (
    <section id='product' className={`md:flex wc-card rounded-[20px] px-3 gap-10`}>
        <div className="pt-5 sm:pt-16 w-full lg:w-[50%] grid grid-rows-[auto_1fr] items-end">
            <div className='flex justify-center'>
                <h2 className={`text-[32px] sm:text-[40px] font-manrope font-semibold text-black text-center`}><span className='text-gradient'>Benefits Of<br/><span className='lg:ml-20'>Our Program</span></span></h2>
            </div>
            <img
            src={customerAndDoctor}
            alt='Get to know us'
            className='w-full'
            />
        </div>
        <div className='flex justify-center items-center w-full lg:w-[50%] px-7 mt-5 ss:mt-0'>
            <ul className='list-disc text-[18px] leading-[30px] lg:text-[20px] lg:leading-[45px] wc-ul py-5 lg:py-0'>
                {benefitsOfOurProgram.map((item) => (
                    <li key={item.id}>{item.content}</li>
                ))}
            </ul> 
        </div>
        
    </section>
  )
}

export default BenefitsOfOurProgram
