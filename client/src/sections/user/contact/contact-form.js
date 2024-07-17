import React, { useState } from 'react'
import DefaultButton from 'src/components/button/default-button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import styles from 'src/style'

import PhoneNumberMaskInput from 'src/components/phonenumber-mask-input';

const ContactForm = () => {
  return (
    <section className="flex-col relative">
        <div className='flex flex-col gap-[24px] sm:gap-[48px] p-[24px] sm:p-[48px] border border-[#00A4F4] rounded-[28px]'>
            <h2 className={`text-[32px] sm:text-[40px] font-manrope font-semibold text-black text-center`}> <span className='text-gradient'>Contact Us</span></h2>
            <div className='flex flex-col sm:flex-row items-center gap-[24px]'>
                <div className='w-full flex flex-col gap-[24px]'>
                    <div className='flex flex-col gap-[16px]'>
                        <p className='text-[16px] sm:text-[20px] font-manrope sm:leading-[40px]'>Have a Question or Inquiry? Connect with Us Below!</p>
                        <p className='text-[16px] sm:text-[20px] font-manrope sm:leading-[40px]'>We're always here when you need us. As your friendly, neighborhood Home Health provider, we're dedicated to offering you the care and support you deserve. Whether you have a question, need assistance, or want to learn more about our services, we're ready to help anytime. Reach out to us today!</p>
                        <p className='text-[16px] sm:text-[20px] font-manrope sm:leading-[40px]'>For further inquiries, please don't hesitate to reach out at <br/><span className='text-primary'>+1 (847) 875-4000</span></p>
                    </div>
                </div>
                <div className='w-full flex flex-col gap-[14px] sm:gap-[30px]'>
                    <div className='flex flex-col sm:flex-row justify-between gap-[14px] sm:gap-[30px]'>
                        <FormControl variant="outlined" className='w-full'>
                            <TextField id="" label="Name" variant="outlined" className='wc-input rounded-full' name="name" type="text" size=''/>
                        </FormControl>
                        <FormControl variant="outlined" className='w-full'>
                            <TextField id="" label="Email" variant="outlined" className='wc-input' name="email" type="email" />
                        </FormControl>
                    </div>
                    <FormControl variant="outlined" className='w-full'>
                        <TextField className='wc-input'
                            InputProps={{
                                inputComponent: PhoneNumberMaskInput,
                            }}
                            name="phone"
                            variant='outlined'
                            fullWidth
                            label="Phone Number"
                        />
                    </FormControl>
                    <TextField id="" label="Message" variant="outlined" className='wc-input' name="message" type="text" multiline rows='3' />
                    <DefaultButton value='Submit' type="submit" />
                </div>
            </div>
        </div>   
    </section>
  )
}

export default ContactForm;
