"use client"

import { Card, CardBody, CardHeader } from "@nextui-org/card"
import { Divider } from "@nextui-org/divider"
import { useParams } from "next/navigation"
import { Button } from "@nextui-org/button";
import router from "next/router";
import { useState } from "react";

export default function Beneficiary () {
   const { id } = useParams()
   enum FingerprintStatusEnum {
      Off,
      GetFingerprints,
      Waiting,
      Success,
      Error,
    }
   const [ FingerprintStatus, setFingerprintStatus ] = useState<any>(FingerprintStatusEnum.Off);
   const [ FingerprintData, setFingerprintData ] = useState<any>({});
   const maxSize = 40;
   //setFingerprintStatus(FingerprintStatusEnum.Off);
   //let FingerprintStatus = useState(FingerprintStatusEnum.Off);
   const checkFingerprint = async (id: any) => {
      try {
         setFingerprintStatus(FingerprintStatusEnum.GetFingerprints);
         const fingerprint = await fetch('http://localhost:3080/api/fingerprint/person/1');
         //console.log(await fingerprint.json());
         const data = await fingerprint.json();
         setFingerprintStatus(FingerprintStatusEnum.Waiting);
         //const capture = await fetch('http://127.0.0.1:8899/api/biometrico/comparar/huella');
         const response = await fetch('http://127.0.0.1:8899/api/biometrico/comparar/huella', {
            method: 'POST',
            headers: {
               'content-type': 'application/json;charset=UTF-8',
            },
            body: JSON.stringify({
               "huellas": data
            }),
         })
         setFingerprintStatus(FingerprintStatusEnum.Success);
         const data2 = await response.json();
         console.log(data2);
         
         setFingerprintData(data2);
         
      } catch (error) {
         setFingerprintStatus(FingerprintStatusEnum.Error);
         throw new Error(`Error: ${error}`);
      }
      //router.push(`/beneficiary/${id}`)
   }
   return (
      <div className="flex flex-col">
         {/* CABECERA PRINCIPAL */}
         <Card className="max-w-[340px] border-small rounded-small border-default-200 dark:border-default-100 mb-3">
            <CardHeader className="justify-between">
               <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-1 items-center justify-center">
                     <h4 className="text-small font-semibold leading-none text-default-700">
                        SUB TENIENTE { id }
                     </h4>
                     <Button data-testid="show" radius='full' size="sm" variant="light" onClick={() => checkFingerprint(id)}>
                           Registrar Huella
                     </Button>
                     Estado: { FingerprintStatusEnum[FingerprintStatus] }
                  </div>
                  <div className="flex flex-col gap-1 items-center justify-center">
                     <h4>Datos</h4>
                     <textarea maxLength={40} defaultValue={FingerprintData}></textarea>
                     {/* <p>Calidad: {FingerprintData.calidad}</p> */}
                  </div>
               </div>
            </CardHeader>
            <Divider/>
            <CardBody>
            </CardBody>
         </Card>
      </div>
   )
}