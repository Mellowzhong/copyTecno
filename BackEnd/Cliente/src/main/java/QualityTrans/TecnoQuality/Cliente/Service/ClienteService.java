package QualityTrans.TecnoQuality.Cliente.Service;

import QualityTrans.TecnoQuality.Cliente.DTOs.ConductorDTO;
import QualityTrans.TecnoQuality.Cliente.DTOs.ConductorResponseDTO;
import QualityTrans.TecnoQuality.Cliente.Entity.Conductor;
import QualityTrans.TecnoQuality.Cliente.Entity.Empresa;
import QualityTrans.TecnoQuality.Cliente.Model.ConductorEmpresa;
import QualityTrans.TecnoQuality.Cliente.Model.ConductorModelo;
import QualityTrans.TecnoQuality.Cliente.Repository.ConductorRepository;
import QualityTrans.TecnoQuality.Cliente.Repository.EmpresaRepository;
import QualityTrans.TecnoQuality.Cliente.Response.ConductorModel;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ClienteService {

    @Autowired
    ConductorRepository conductorRepository;

    @Autowired
    EmpresaRepository empresaRepository;

    /*Conductores*/

    public Conductor ingresarConductor(ConductorModelo conductor, MultipartFile qrImage) throws IOException {
        if (conductor != null && validarConductor(conductor.getRun())) {
            Conductor conductorNuevo = new Conductor();
            Empresa empresa = empresaRepository.findByNombreEmpresa(conductor.getNombre_empresa());
            conductorNuevo.setNombre(conductor.getNombre());
            conductorNuevo.setApellido(conductor.getApellido());
            conductorNuevo.setTelefono(conductor.getTelefono());
            conductorNuevo.setEmail(conductor.getEmail());
            conductorNuevo.setDireccion(conductor.getDireccion());
            conductorNuevo.setRun(conductor.getRun());
            conductorNuevo.setFechaNacimiento(conductor.getFechaNacimiento());
            if (empresa != null) {
                conductorNuevo.setId_empresa(empresa.getId());
            } else {
                conductorNuevo.setId_empresa(null);
            }
            conductorNuevo.setComuna(conductor.getComuna());
            conductorNuevo.setCiudad(conductor.getCiudad());
            conductorNuevo.setQrImage(qrImage.getBytes());
            return conductorRepository.save(conductorNuevo);
        } else {
            throw new IllegalArgumentException("No se pudo ingresar conductor");
        }
    }

    public Boolean validarConductor(String rut){
        Conductor conductor = conductorRepository.findByRun(rut);
        if (conductor != null) {
            return false;
        } else {
            return true;
        }
    }

    public ConductorDTO convertirConductorADTO(Conductor conductor) {
        ConductorDTO conductorDTO = new ConductorDTO();
        conductorDTO.setId(conductor.getId());
        conductorDTO.setNombre(conductor.getNombre());
        conductorDTO.setApellido(conductor.getApellido());
        conductorDTO.setFechaNacimiento(conductor.getFechaNacimiento());
        conductorDTO.setEmail(conductor.getEmail());
        conductorDTO.setTelefono(conductor.getTelefono());
        conductorDTO.setRun(conductor.getRun());
        conductorDTO.setDireccion(conductor.getDireccion());
        conductorDTO.setId_empresa(conductor.getId_empresa());
        conductorDTO.setFechaCreacion(conductor.getFechaCreacion());
        conductorDTO.setComuna(conductor.getComuna());
        conductorDTO.setCiudad(conductor.getCiudad());
        return conductorDTO;
    }

    public ConductorResponseDTO buscarConductorPorRun(String run) {
        Conductor conductor = conductorRepository.findByRun(run);
        Empresa empresa = empresaRepository.findById(conductor.getId_empresa()).get();

        ConductorResponseDTO responseDTO = ConductorResponseDTO.builder()
                .id(conductor.getId())
                .nombre(conductor.getNombre())
                .apellido(conductor.getApellido())
                .email(conductor.getEmail())
                .telefono(conductor.getTelefono())
                .run(conductor.getRun())
                .direccion(conductor.getDireccion())
                .nombre_empresa(empresa.getNombreEmpresa())
                .fechaCreacion(conductor.getFechaCreacion())
                .comuna(conductor.getComuna())
                .ciudad(conductor.getCiudad())
                .fechaNacimiento(conductor.getFechaNacimiento())
                .build();
        return responseDTO;
    }

    public ConductorModel buscarConductorPorId(Long id) {
        Conductor conductor =  conductorRepository.findById(id).get();
        return ConductorModel.builder()
                .nombre(conductor.getNombre())
                .apellido(conductor.getApellido())
                .build();
    }

    public Conductor actualizarConductor(ConductorResponseDTO conductor, MultipartFile qrImage) throws IOException {
        if (conductor != null && !validarConductor(conductor.getRun())) {
            Conductor conductorExistente = conductorRepository.findByRun(conductor.getRun());
            Empresa empresa = empresaRepository.findByNombreEmpresa(conductor.getNombre_empresa());
            System.out.println("empresa: " + empresa);
            conductorExistente.setNombre(conductor.getNombre());
            conductorExistente.setApellido(conductor.getApellido());
            conductorExistente.setTelefono(conductor.getTelefono());
            conductorExistente.setEmail(conductor.getEmail());
            conductorExistente.setDireccion(conductor.getDireccion());
            conductorExistente.setRun(conductor.getRun());
            conductorExistente.setFechaNacimiento(conductor.getFechaNacimiento());
            conductorExistente.setId_empresa(empresa.getId());
            conductorExistente.setComuna(conductor.getComuna());
            conductorExistente.setCiudad(conductor.getCiudad());
            conductorExistente.setFechaCreacion(conductor.getFechaCreacion());
            conductorExistente.setQrImage(qrImage.getBytes());

            return conductorRepository.save(conductorExistente);
        } else {
            throw new IllegalArgumentException("No se puede actualizar el conductor");
        }
    }

    @Transactional
    public List<ConductorDTO> buscarConductoresPorFechaCreacion(LocalDate fechaCreacion) {
        List<Conductor> conductores = conductorRepository.findAllByFechaCreacion(fechaCreacion);
        List<ConductorDTO> conductorDTOS = new ArrayList<>();
        for (Conductor conductor : conductores) {
            ConductorDTO conductorTemp = convertirConductorADTO(conductor);
            conductorDTOS.add(conductorTemp);
        }
        return conductorDTOS;
    }

    @Transactional
    public List<ConductorDTO> buscarConductoresEntreFechas(LocalDate desde, LocalDate hasta) {
        List<Conductor> conductores = conductorRepository.findByFechaCreacionBetween(desde,hasta);
        List<ConductorDTO> conductorDTOS = new ArrayList<>();
        for (Conductor conductor : conductores) {
            ConductorDTO conductorTemp = convertirConductorADTO(conductor);
            conductorDTOS.add(conductorTemp);
        }
        return conductorDTOS;
    }

    public ConductorEmpresa buscarConductorEspecifico(Long id) {
        Conductor conductor = conductorRepository.findById(id).orElse(null);
        if (conductor != null) {
            Empresa empresa = empresaRepository.findById(conductor.getId_empresa()).orElse(null);
            ConductorEmpresa conductorEmpresa = new ConductorEmpresa();
            ConductorDTO conductorDTO = convertirConductorADTO(conductor);
            conductorEmpresa.setConductor(conductorDTO);
            conductorEmpresa.setEmpresa(empresa);
            return conductorEmpresa;
        } else {
            throw new IllegalArgumentException("No se encontró el conductor con el ID proporcionado");
        }
    }

    public void eliminarConductor(String run) {
        Conductor conductor = conductorRepository.findByRun(run);
        if (conductor != null) {
            conductorRepository.delete(conductor);
        } else {
            throw new IllegalArgumentException("No se puede eliminar la conductor");
        }
    }

    /* Empresa */

    public Empresa ingresarEmpresa(Empresa empresa) {
        if (empresa != null && validarEmpresa(empresa.getRutEmpresa())) {
            return empresaRepository.save(empresa);
        } else {
            throw new IllegalArgumentException("El empresa no puede ser nulo");
        }
    }

    public Boolean validarEmpresa(String rut) {
        Empresa empresa = empresaRepository.findByRutEmpresa(rut);
        if (empresa != null) {
            return false;
        } else {
            return true;
        }
    }

    public Empresa buscarEmpresaPorRut(String rut) {
        return empresaRepository.findByRutEmpresa(rut);
    }

    public List<Empresa> buscarEmpresas() {return empresaRepository.findAll();}

    public void eliminarEmpresaById(Long id){
        Empresa empresa = empresaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("No se puede eliminar la empresa"));
        empresaRepository.delete(empresa);
    }

    public Empresa actualizarEmpresa(Empresa empresa){
        if (empresa != null){
            Empresa empresaExistente = empresaRepository.findByRutEmpresa(empresa.getRutEmpresa());
            // Actualizar los campos de la empresa existente
            empresaExistente.setNombreEmpresa(empresa.getNombreEmpresa());
            empresaExistente.setRutEmpresa(empresa.getRutEmpresa());
            empresaExistente.setEmailEmpresa(empresa.getEmailEmpresa());
            empresaExistente.setGiro(empresa.getGiro());
            empresaExistente.setDireccionEmpresa(empresa.getDireccionEmpresa());
            empresaExistente.setTelefonoEmpresa(empresa.getTelefonoEmpresa());
            empresaExistente.setComunaEmpresa(empresa.getComunaEmpresa());
            return empresaRepository.save(empresaExistente);
        } else {
            throw new IllegalArgumentException("No se puede actualizar la empresa");
        }
    }

}