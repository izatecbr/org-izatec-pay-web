import { format, parseISO } from "date-fns";

export default class Utils {

    static formatDateISO(date: Date): string {
        if (!date) {
            return ''
        }
        return date.toISOString().split('T')[0];
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
            return null
        }
        return JSON.parse(atob(token.split(".")[1]));
    };

    static removeCharacters = (str: string) => {
        return str ? str.replace(/[^a-zA-Z0-9]/g, '') : null
    }

    static removePhoneMask = (phone: string) => {
        return phone ? phone.replace(/[()\s-]+/g, '') : 99999999999
    }

    static numberToInputMask = (num: number) => {
        return num ? num.toFixed(2) : '0.00'
    }

    static moneyMaskToNumber = (valor: string) => {
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


}