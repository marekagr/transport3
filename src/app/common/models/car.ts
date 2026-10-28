export interface Car {
    _id:string,
    active:boolean,
    name: string,
    typeid : string,
    make?: string
    model: string,    
    licence_number:string,
    vin:string,
    sn:string,
    certificate:string,
    chassis_number:string,
    engine_number:string,
    year_production:Date,
    date_registered:Date,
    inventory_number ?:string,
    engine_capacity:number,
    destinationid:string,

    petrolid:string,
    tank_capacity1:number,
    tank_capacity2:number,
    hour_cost:number,
    km_cost:number,
    
    meter_reading_start:number
    meter_reading_date_start:Date,
    meter_reading_end:number
    meter_reading_date_end:Date,

  }