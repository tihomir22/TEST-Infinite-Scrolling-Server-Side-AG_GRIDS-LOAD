import { Component, ViewChild } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  public gridApi;
  public gridColumnApi;

  public columnDefs;
  public defaultColDef;
  public rowModelType;
  public cacheBlockSize;
  public maxBlocksInCache;
  public rowData: [];
  public indiceInicial: number = 0;

  constructor(private http: HttpClient) {
    this.columnDefs = [
      { field: "id" },
      {
        field: "athlete",
        width: 150,
        filter: true
      },
      { field: "age" },
      { field: "country" },
      { field: "year" },
      { field: "sport" },
      { field: "gold" },
      { field: "silver" },
      { field: "bronze" }
    ];
    this.defaultColDef = {
      width: 120,
      resizable: true
    };
    this.rowModelType = "serverSide";
    this.cacheBlockSize = 100;
    this.maxBlocksInCache = 10;
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    /* this.http
      .get("https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinners.json")
      .subscribe((data:any) => {
        var idSequence = 0;
        data.forEach(function(item) {
          item.id = idSequence++;
        });
        var server =  this.FakeServer(data);
        var datasource =  this.ServerSideDatasource();
        params.api.setServerSideDatasource(datasource);
      });*/
    var datasource = this.ServerSideDatasource(this);
    params.api.setServerSideDatasource(datasource);
  }

  public ServerSideDatasource(contexto: any) {
    return {
      getRows(params) {
        contexto.http
          .get(
            "https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinners.json"
          )
          .subscribe((data: Array<any>) => {
            //aqui en vez de hacer el slice le pasariamos al back los parametros para que nos devuelva los datos ya "sliceados"
            data = data.slice(params.request.startRow, params.request.endRow);
            //meramente decorativo para ver el indice de forma incremental
            data.forEach(function(item) {
              item.id = contexto.indiceInicial++;
            });

            /*
             * Si hay exito en la cosulta lanzamos esta callback si no failCallBack().
             * Debemos comprobar si los datos que nos llegan son menores del bloque requerido, si es asi debemos devolver el length
             * de los datos recibidos y alli terminaria el infinite scroll , si solicitamos 15000 y devuelve 15000 devolveremos en la
             * successCallBack un -1
             *  */
            
            params.successCallback(data, -1);
          });

        //var response = server.getResponse(params.request);

        /*if (response.success) {
            params.successCallback(response.rows, response.lastRow);
          } else {
            params.failCallback();
          }*/
      }
    };
  }

  /*public FakeServer(allData) {
    return {
      getResponse(request) {
        console.log(
          "asking for rows: " + request.startRow + " to " + request.endRow
        );
        var rowsThisPage = allData.slice(request.startRow, request.endRow);
        var lastRow = allData.length <= request.endRow ? allData.length : -1;
        return {
          success: true,
          rows: rowsThisPage,
          lastRow: lastRow
        };
      }
    };
  }*/
}
