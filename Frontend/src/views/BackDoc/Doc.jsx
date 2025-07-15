const Doc = () => {
    return (
        <div className="flex flex-col md:flex-row gap-8 justify-center my-10">
            {/* Backend Documentation Card */}
            <div className="max-w-[700px] w-full p-8 bg-white rounded-[10px] shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
                <div>
                    <h1 className="mb-4 text-[#2c3e50] text-3xl font-bold">Documentación del Backend</h1>
                    <p className="mb-6 text-[#555]">
                        Aquí encontrarás toda la información necesaria para utilizar el backend de la aplicación de manera efectiva.
                    </p>
                    <div className="mb-5">
                        <h2 className="text-[#2980b9] text-xl font-bold">
                            Documentación del Backend Usuario
                        </h2>
                        <a
                            href="http://localhost:8080/swagger-ui/index.html#/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#16a085] underline break-all"
                        >
                            http://localhost:8080/swagger-ui/index.html#/
                        </a>
                    </div>
                    <div className="mb-5">
                        <h2 className="text-[#2980b9] text-xl font-bold">
                            Documentación del Backend Formulario
                        </h2>
                        <a
                            href="http://localhost:8081/swagger-ui/index.html#/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#16a085] underline break-all"
                        >
                            http://localhost:8081/swagger-ui/index.html#/
                        </a>
                    </div>
                    <div className="mb-5">
                        <h2 className="text-[#2980b9] text-xl font-bold">
                            Documentación del Backend Cliente
                        </h2>
                        <a
                            href="http://localhost:8082/swagger-ui/index.html#/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#16a085] underline break-all"
                        >
                            http://localhost:8082/swagger-ui/index.html#/
                        </a>
                    </div>
                    <div>
                        <h2 className="text-[#2980b9] text-xl font-bold">
                            Documentación del Backend Documentos
                        </h2>
                        <a
                            href="http://localhost:8083/swagger-ui/index.html#/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#16a085] underline break-all"
                        >
                            http://localhost:8083/swagger-ui/index.html#/
                        </a>
                    </div>
                </div>
            </div>
            {/* Frontend Documentation Card */}
            <div className="max-w-[700px] w-full p-8 bg-white rounded-[10px] shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
                <div>
                    <h1 className="mb-4 text-[#2c3e50] text-3xl font-bold">Documentación del Frontend</h1>
                    <p className="mb-6 text-[#555]">
                        Aquí encontrarás toda la información necesaria para desarrollar y mantener el frontend de la aplicación.
                    </p>
                    <div className="mb-5">
                        <h2 className="text-[#2980b9] text-xl font-bold">
                            Repositorio del Frontend
                        </h2>
                        <a
                            href="https://github.com/DanielFrez/TencoQuality.git"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#16a085] underline break-all"
                        >
                            https://github.com/DanielFrez/TencoQuality.git
                        </a>
                    </div>
                    <div className="mb-5">
                        <h2 className="text-[#2980b9] text-xl font-bold">
                            Generar la documentación del Frontend
                        </h2>
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            className="break-all"
                        >
                            npm run docs
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Doc;