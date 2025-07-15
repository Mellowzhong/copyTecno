import React, { useRef, useEffect } from "react";

export default function CompanyModal({
    handleNewCompanyToggle,
    handleSubmitCompany,
    handleCompanyChange,
    companyFormData,
    companyLoading,
    companySuccess,
    companyError
}) {
    const inputRef = useRef(null);

    // Solo enfoca el input de nombre al abrir el modal por primera vez
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-8 relative">
                <button
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl"
                    onClick={handleNewCompanyToggle}
                    type="button"
                    aria-label="Cerrar"
                >×</button>
                <h3 className="text-xl font-bold mb-4">Agregar nueva empresa</h3>
                <form onSubmit={handleSubmitCompany} className="space-y-4">
                    {companySuccess && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded">
                            {companySuccess}
                        </div>
                    )}
                    {companyError && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
                            {companyError}
                        </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                            <input
                                ref={inputRef}
                                type="text"
                                name="nombreEmpresa"
                                value={companyFormData.nombreEmpresa}
                                onChange={handleCompanyChange}
                                placeholder="Compañía Limitada"
                                className="w-full px-3 py-2 border border-gray-300 rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Giro</label>
                            <input
                                type="text"
                                name="giro"
                                value={companyFormData.giro}
                                onChange={handleCompanyChange}
                                placeholder="Transporte"
                                className="w-full px-3 py-2 border border-gray-300 rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">RUT</label>
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    name="rutBody"
                                    value={companyFormData.rutBody}
                                    onChange={handleCompanyChange}
                                    placeholder="11.222.333"
                                    className="w-3/4 px-3 py-2 border border-gray-300 rounded"
                                    required
                                    maxLength={10}
                                />
                                <span className="flex items-center font-bold">-</span>
                                <input
                                    type="text"
                                    name="rutDv"
                                    value={companyFormData.rutDv}
                                    onChange={handleCompanyChange}
                                    placeholder="K"
                                    className="w-1/4 px-3 py-2 border border-gray-300 rounded text-center"
                                    required
                                    maxLength={1}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Comuna</label>
                            <input
                                type="text"
                                name="comunaEmpresa"
                                value={companyFormData.comunaEmpresa}
                                onChange={handleCompanyChange}
                                placeholder="Santiago"
                                className="w-full px-3 py-2 border border-gray-300 rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                            <input
                                type="text"
                                name="direccionEmpresa"
                                value={companyFormData.direccionEmpresa}
                                onChange={handleCompanyChange}
                                placeholder="Calle Principal 123"
                                className="w-full px-3 py-2 border border-gray-300 rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                name="emailEmpresa"
                                value={companyFormData.emailEmpresa}
                                onChange={handleCompanyChange}
                                placeholder="empresa@correo.com"
                                className="w-full px-3 py-2 border border-gray-300 rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                            <input
                                type="tel"
                                name="telefonoEmpresa"
                                value={companyFormData.telefonoEmpresa}
                                onChange={handleCompanyChange}
                                placeholder="+56 9 1234 5678"
                                className="w-full px-3 py-2 border border-gray-300 rounded"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <button
                            type="submit"
                            className={`w-full py-2 px-4 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors ${companyLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                            disabled={companyLoading}
                        >
                            {companyLoading ? 'Registrando...' : 'Registrar Empresa'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}