import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { PermitType } from '../types';

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function PermitsTable({ products }: { products: PermitType[] }) {
    return (
        <div className="p-2 bg-white rounded-lg w-full">
            <DataTable value={products} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '10rem' }} pt={{
                thead: { className: "text-[14px]" },
                paginator: {
                    pageButton: ({ context }: { context: any }) => ({
                        className: context.active ? 'bg-blue-500 text-white' : undefined,
                    }),
                },
            }}>
                <Column field="name" header="Name" sortable style={{ width: '30%' }}></Column>
                <Column field="reason" header="Reason" style={{ width: '40%' }}></Column>
                <Column field="plate" header="Plate" sortable style={{ width: '30%' }}></Column>
            </DataTable>
        </div >
    );
}

