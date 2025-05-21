import { format, parseISO } from "date-fns";

export default class Utils {

    static formatDateISO(date: any): string {
        if (!date) {
            return '';
        }
    
        // Garantir que o parâmetro seja uma instância de Date
        const localDate = new Date(date);
    
        // Ajustar a data para o horário local
        localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset());
    
        // Formatar a data no formato ISO-8601, sem a parte de tempo
        return localDate.toISOString().split('T')[0];
    }
    

    static formatTimeHHMM(date: any): string {
        if (!date) {
            return '';
        }

        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${hours}:${minutes}`;
    }


    static formatDate = (date: Date) => {
        if (!date) {
            return ''
        }
        const formatter = new Intl.DateTimeFormat('pt-BR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });

        return formatter.format(date);
    };

    static clone = (value: any) => {
        return JSON.parse(JSON.stringify(value));
    }

    static formatToBRL = (value: number) => {
        const formatter = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

        return formatter.format(value) || 'não informado'
    };

    static formatDateToBR = (dateString: string) => {
        if (!dateString) {
            return ''
        }
        const formattedDate = format(parseISO(dateString), 'dd/MM/yyyy');
        return formattedDate;
    };
    static jwtToObject = (token: string | null) => {
        if (!token) {
            return null;
        }

        try {
            const base64Url = token.split(".")[1];
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split("")
                    .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, "0")}`)
                    .join("")
            );
            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error("Failed to parse JWT", error);
            return null;
        }
    };

    static removeCharacters = (str: string) => {
        return str ? str.replace(/[^a-zA-Z0-9]/g, '') : null
    }

    static removePhoneMask = (phone: string) => {
        return phone ? phone.replace(/[()\s-]+/g, '') : 99999999999
    }

    static numberToInputMask = (num: number) => {
        return num
            ? new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                minimumFractionDigits: 2,
            }).format(num)
            : 'R$ 0,00';
    };

    static moneyMaskToNumber = (valor: any) => {


        if (!valor) return 0.0
        return valor ? Number(valor.replace(/\D/g, '').replace(/(\d+)(\d{2})/, '$1.$2')) : 0.0
    }

    static copyToCliboard = async (text: string) => {
        let copied = false
        try {
            await navigator.clipboard.writeText(text);
            copied = true;
            setTimeout(() => copied = false, 2000);
        } catch (err) {
            console.error('Erro ao copiar texto: ', err);
        }
        return text;
    }

    static getUserInitials = (name: string | null | undefined) => {
        if (!name) return '';
        return name[0].toUpperCase() + name[1].toUpperCase()
    }

    static formatCpfCnpj = (value: string | null | undefined): string => {
        if (!value) return '';

        const cleaned = value.replace(/\D/g, '');
        const length = cleaned.length;

        if (length <= 11) {
            return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        }

        if (length <= 14) {
            return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
        }

        return value;
    };

    static maskCpfCnpj = (value: string | null | undefined): string => {
        if (!value) return '';

        const cleaned = value.replace(/\D/g, '');
        const length = cleaned.length;

        if (length <= 11) {
            return cleaned.replace(/(\d{3})(\d{2})(\d{3})(\d{2})/, '$1.**.***-$4');
        }

        if (length <= 14) {
            return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{2})(\d{2})/, '$1.***.***/**-$5');
        }

        return value;
    };

    static truncate = (str: string | undefined | null, length: number = 15) => {
        if (!str) return '';
        return str.length > length ? str.substring(0, length) + '...' : str;
    }

    static cleanParams = (params: any) => {
        for (const key in params) {
            if ([undefined, "", null].includes(params[key])) {
                delete params[key];
            }
        }
        return params;
    }



}