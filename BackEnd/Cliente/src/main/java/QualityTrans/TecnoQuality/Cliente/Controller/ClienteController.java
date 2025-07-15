package QualityTrans.TecnoQuality.Cliente.Controller;

import QualityTrans.TecnoQuality.Cliente.DTOs.ConductorDTO;
import QualityTrans.TecnoQuality.Cliente.DTOs.ConductorResponseDTO;
import QualityTrans.TecnoQuality.Cliente.Entity.Conductor;
import QualityTrans.TecnoQuality.Cliente.Entity.Empresa;
import QualityTrans.TecnoQuality.Cliente.Model.ConductorEmpresa;
import QualityTrans.TecnoQuality.Cliente.Model.ConductorModelo;
import QualityTrans.TecnoQuality.Cliente.Response.ConductorModel;
import QualityTrans.TecnoQuality.Cliente.Service.ClienteService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/Cliente")
public class ClienteController {

    @Autowired
    ClienteService clienteService;

    /* Conductores */
    @GetMapping("/")
    public String index() {
        return "index";
    }

    @PostMapping(value ="/ingresarConductor", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ConductorModelo> ingresarConductor(@RequestPart ConductorModelo conductor,
                                                             @RequestPart MultipartFile qrImage) throws IOException {
        Conductor conductorNuevo = clienteService.ingresarConductor(conductor, qrImage);
        return ResponseEntity.ok(conductor);
    }

    @PostMapping(value ="/actualizarConductor", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Conductor> actualizarConductor(@RequestPart ConductorResponseDTO conductor, @RequestPart MultipartFile qrImage) throws IOException {
        System.out.println(conductor);
        Conductor conductorActualizado = clienteService.actualizarConductor(conductor, qrImage);
        return ResponseEntity.ok(conductorActualizado);
    }

    @Transactional
    @GetMapping("/buscarConductor/{run}")
    public ResponseEntity<ConductorResponseDTO> buscarConductor(@PathVariable("run") String run) {
        ConductorResponseDTO conductor = clienteService.buscarConductorPorRun(run);
        if (conductor != null) {
            return ResponseEntity.ok(conductor);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/buscarConductores/hoy")
    public ResponseEntity<List<ConductorDTO>> buscarConductoresHoy() {
        return ResponseEntity.ok(clienteService.buscarConductoresPorFechaCreacion(LocalDate.now()));
    }

    @GetMapping("buscarConductores/fecha/{desde}")
    public ResponseEntity<List<ConductorDTO>> buscarConductoresDesdeFecha
            (@PathVariable("desde") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaDesde){
        return ResponseEntity.ok(clienteService.buscarConductoresEntreFechas(fechaDesde,LocalDate.now()));
    }

    @GetMapping("/buscarConductoresByID/{id}")
    public ResponseEntity<ConductorModel> buscarConductoresById(@PathVariable Long id) {
        return ResponseEntity.ok(clienteService.buscarConductorPorId(id));
    }

    @GetMapping("/buscarConductores/{ID}")
    public ResponseEntity<ConductorEmpresa> buscarConductorEspecifico(@PathVariable("ID")Long id) {
        ConductorEmpresa conductorEmpresa = clienteService.buscarConductorEspecifico(id);
        if (conductorEmpresa != null && conductorEmpresa.getConductor() != null) {
            return ResponseEntity.ok(conductorEmpresa);
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    @DeleteMapping("/eliminarConductor/{run}")
    public ResponseEntity<Map<String, String>> eliminarConductor(@PathVariable("run") String run) {
        try {
            clienteService.eliminarConductor(run);
            return ResponseEntity.ok(Map.of("message", "Conductor eliminado con éxito"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al eliminar el conductor"));
        }
    }

    /* Empresas */

    @PostMapping("/ingresarEmpresa")
    public ResponseEntity<Empresa> ingresarEmpresa(@RequestBody Empresa empresa) {
        System.out.println(empresa);
        Empresa empresaNueva = clienteService.ingresarEmpresa(empresa);
        return ResponseEntity.ok(empresaNueva);
    }

    @GetMapping("/buscarEmpresas")
    public ResponseEntity<List<Empresa>> buscarEmpresas() {
        return ResponseEntity.ok(clienteService.buscarEmpresas());
    }

    @GetMapping("/buscarEmpresa/{rut}")
    public ResponseEntity<Empresa> buscarEmpresa(@PathVariable("rut") String rut) {
        return ResponseEntity.ok(clienteService.buscarEmpresaPorRut(rut));
    }

    @PostMapping("/actualizarEmpresa")
    public ResponseEntity<Empresa> actualizarEmpresa(@RequestBody Empresa empresa) {
        System.out.println(empresa);
        Empresa empresaActualizada = clienteService.actualizarEmpresa(empresa);
        return ResponseEntity.ok(empresaActualizada);
    }

    @DeleteMapping("/eliminarEmpresaById/{id}")
    public ResponseEntity<Map<String, String>> eliminarEmpresa(@PathVariable Long id) {
        try {
            clienteService.eliminarEmpresaById(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Empresa eliminada exitosamente");
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }

    // /Cliente/eliminarEmpresaById/${id}`);
}
