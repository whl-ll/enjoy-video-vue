import {format} from "date-fns";

export default {

    methods: {

        formatDate(date, dateFormat){
            return format(new Date(date), dateFormat);
        }
    }

}