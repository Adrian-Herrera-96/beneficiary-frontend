'use client';
import { apiClient } from '@/services';
import { Checkbox, CheckboxGroup } from '@nextui-org/checkbox';
import { useCallback, useMemo, useState } from 'react';
import { cn } from '@nextui-org/theme';
import React from 'react';
import { faEdit, faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ModalComponent from '@/components/modal';
import { Tooltip } from '@nextui-org/tooltip';
import { Button } from '@nextui-org/button';

interface AffiliateDocumentsProps {
  affiliate: any;
  documents: any;
}

export const AffiliateDocuments = React.memo(
  ({ affiliate, documents }: AffiliateDocumentsProps) => {
    const [groupSelected, setGroupSelected] = useState<any>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentDocumentId, setCurrentDocumentId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const toggleDialog = () => setIsDialogOpen(!isDialogOpen);
    const hasNoDocuments = useMemo(() => documents && documents.status, [documents]);

    const handleDocumentDownload = useCallback(
      async (documentId: any) => {
        if (typeof window !== 'undefined' && affiliate) {
          const printJS = (await import('print-js')).default;
          const response = await apiClient.GET(
            `/api/affiliates/${affiliate.id}/documents/${documentId}`,
          );
          const pdfBlob = await response.blob();
          const pdfURL = URL.createObjectURL(pdfBlob);
          printJS({ printable: pdfURL, type: 'pdf', showModal: true });
          URL.revokeObjectURL(pdfURL);
        } else {
          alert('sin id');
        }
      },
      [affiliate],
    );
    const handleDocumentUpdate = async (documentId: any) => {
      setCurrentDocumentId(documentId);
      toggleDialog();
    };

    const uploadFile = async (file: any) => {
      console.log(file.name);
      const formData = new FormData();
      formData.append('documentPdf', file);
      try {
        setIsLoading(true);
        const response = await apiClient.POST(
          `/api/affiliates/${affiliate.id}/document/${currentDocumentId}/createOrUpdate`,
          formData,
          true,
        );
        console.log(response);
      } catch (e: any) {
        console.log(e);
        console.error('Error al cargar el archivo');
      } finally {
        setIsLoading(false);
        toggleDialog();
      }
    };

    return (
      <div className="flex flex-col w-full">
        {!hasNoDocuments ? (
          <div className="flex items-center justify-center text-center h-full w-full">
            <fieldset className="border border-gray-400 rounded-md py-10 w-full">
              <legend> </legend>
              <span className="">Sin documentos</span>
            </fieldset>
          </div>
        ) : (
          <div className="max-h-[400px] overflow-y-auto w-full">
            <CheckboxGroup
              value={groupSelected}
              onChange={setGroupSelected}
              classNames={{ base: 'w-full' }}
            >
              {documents.documentsAffiliate.length >= 0 &&
                documents.documentsAffiliate.map((document: any) => (
                  <Checkbox
                    key={document.procedureDocumentId}
                    value={document.procedureDocumentId}
                    color="default"
                    size="lg"
                    radius="sm"
                    classNames={{
                      base: cn(
                        'inline-flex max-w-full w-full bg-content1 m-0 border-gray-400',
                        'hover:bg-content3 dark:hover:border-lime-400 bg-content2 items-center justify-start',
                        'cursor-pointer rounded-lg gap-2 p-4 border',
                        'data-[selected=true]:border',
                      ),
                      label: 'w-full',
                    }}
                    defaultSelected
                    // onValueChange={(isSelected) => {
                    //   if (isSelected) {
                    //     handleDownloadDocument(document.procedureDocumentId);
                    //   }
                    // }}
                  >
                    <div className="w-full flex justify-between gap-3">
                      <span className="text-sm uppercase">
                        {document.name}
                        <b>&nbsp;({document.shortened})</b>
                      </span>
                      <div className="flex flex-row items-end gap-1">
                        <Tooltip content="Visualizar documento">
                          <Button
                            isIconOnly
                            onPress={() => handleDocumentDownload(document.procedureDocumentId)}
                            className="p-1"
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </Button>
                        </Tooltip>
                        <Tooltip content="Editar documento">
                          <Button
                            isIconOnly
                            onPress={() => handleDocumentUpdate(document.procedureDocumentId)}
                            className="p-1"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </Button>
                        </Tooltip>
                      </div>
                    </div>
                  </Checkbox>
                ))}
            </CheckboxGroup>
          </div>
        )}
        <ModalComponent
          open={isDialogOpen}
          onOpenChange={toggleDialog}
          uploadFile={uploadFile}
          loading={isLoading}
        />
      </div>
    );
  },
);
