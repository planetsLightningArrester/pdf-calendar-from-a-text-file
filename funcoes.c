#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "funcoes.h"
int getDayCode(int year)
{
    int fday;
    fday=(((year-1)*365+(year-1)/4-(year-1)/100+(year-1)/400)+1)%7;
    return fday;
}

int getFirstDay(int year,int month)
{
    int fday=getDayCode(year);
    int num_days=0; //number of days of the year before the current month
    int dCode=getDayCode(year);
    switch(month)
    {
    case 12:
        num_days+=30;
    case 11:
        num_days+=31;
    case 10:
        num_days+=30;
    case 9:
        num_days+=31;
    case 8:
        num_days+=31;
    case 7:
        num_days+=30;
    case 6:
        num_days+=31;
    case 5:
        num_days+=30;
    case 4:
        num_days+=31;
    case 3:
        num_days+=28;
    case 2:
        num_days+=31;
    }
    if(month==1)
        return(fday);
    else if(((year%4==0) || (year%400==0)) && (month>2))
        return (num_days+1+dCode)%7 ;
//leap year
    else
        return (num_days+dCode)%7;
}

void printCar(int year, int month,TipoLista Lista,int idioma)
{
    int fday_month=getFirstDay(year,month);
    int code[7]= {0,1,2,3,4,5,6};
    char *Day[7]= {"Domingo","Segunda-Feira","Terca-Feira","Quarta-Feira","Quinta-Feira","Sexta-Feira","Sabado"};
    char *Day_E[7]= {"Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"};
    char*Month[12]= {"Janeiro","Fevereiro","Marco","Abril","Maio","Junho","Julho","Agosto","Setembro",
                     "Outubro","Novembro","Dezembro"
                    };
    char*Month_E[12]= {"January","February","March","April","May","June","July","August","September",
                       "October","November","December"
                      };
    int num_days;
    if(month==1||month==3||month==5||month==7|| month==8|| month==10|| month==12)
        num_days=31;
    else if(month==2)
    {
        if((year%4==0) || (year%400==0))
            num_days=29;
        else
            num_days=28;
    }
    else
        num_days=30;
    if(idioma == 0)
        printf("\n%s %d\n\n",Month[month-1],year);
    else
        printf("\n%s %d\n\n",Month_E[month-1],year);
    int d=1;
    while(d<=num_days)
    {
        if(fday_month>6)
            fday_month=0;
        if(idioma == 0)
            printf("%d %s\n",d,Day[code[fday_month]]);
        else
            printf("%d %s\n",d,Day_E[code[fday_month]]);
        Apontador ve;
        ve = Lista.Primeiro->Prox;
        while (ve != NULL)
        {
            if(ve->Item.ano == year && ve->Item.dia == d && ve->Item.evento=='O')
            {
                printf("   %s",ve->Item.descricao);
            }
            else if(ve->Item.ano == year && ve->Item.dia == d && ve->Item.evento!='O')
            {
                printf("   %c %s",ve->Item.evento,ve->Item.descricao);
            }
            ve = ve->Prox;
        }
        d++;
        fday_month++;
    }
    printf("\n");
}

void FLVazia(TipoLista *Lista)
{
    Lista->Primeiro = (Apontador) malloc(sizeof(Celula));
    Lista->Ultimo = Lista->Primeiro;
    Lista->Primeiro->Prox = NULL;
}

void Insere(TipoItem x, TipoLista *Lista)
{
    Lista->Ultimo->Prox =(Apontador) malloc(sizeof(Celula));
    Lista->Ultimo = Lista->Ultimo->Prox;
    Lista->Ultimo->Item = x;
    Lista->Ultimo->Prox = NULL;
}

void Imprime(TipoLista Lista)
{
    Apontador Aux;
    Aux = Lista.Primeiro->Prox;
    while (Aux != NULL)
    {
        printf("    %d %d %d %c %s",Aux->Item.dia, Aux->Item.mes, Aux->Item.ano, Aux->Item.evento,Aux->Item.descricao);
        Aux = Aux->Prox;
    }
}

void ordena(TipoLista *Lista)
{
    Celula tmp;
    int E_aux;
    Apontador menor = Lista->Primeiro->Prox;
    Apontador dmenor = menor->Prox;
    while(dmenor!=NULL)
    {
        /*if(Item.evento == 'A')
            E_aux=1;
        if(Item.evento == 'F')
            E_aux=2;
        if(Item.evento == 'V')
            E_aux=3;
        if(Item.evento == 'O')
            E_aux=4;*/
        if(menor->Item.ano>dmenor->Item.ano)
        {
            tmp.Item.ano = dmenor->Item.ano;
            dmenor->Item.ano = menor->Item.ano;
            menor->Item.ano = tmp.Item.ano;
        }
        else if(menor->Item.mes>dmenor->Item.mes)
        {
            tmp.Item.mes = dmenor->Item.mes;
            dmenor->Item.mes = menor->Item.mes;
            menor->Item.mes = tmp.Item.mes;
        }
        else if(menor->Item.dia>dmenor->Item.dia)
        {
            tmp.Item.dia = dmenor->Item.dia;
            dmenor->Item.dia = menor->Item.dia;
            menor->Item.dia = tmp.Item.dia;
        }
        else if(menor->Item.evento>dmenor->Item.evento)
        {
            tmp.Item.dia = dmenor->Item.dia;
            dmenor->Item.dia = menor->Item.dia;
            menor->Item.dia = tmp.Item.dia;
        }
        dmenor = dmenor->Prox;
        if(dmenor == NULL)
        {
            menor = menor->Prox;
            dmenor = menor->Prox;
        }
    }
}

void Le_arquivo(char*nome_arq,int mes,int ano,char*Escolha,int idioma)
{
    FILE *p;
    int s=0;
    p = fopen(strcat(nome_arq,".txt"),"r");
    TipoLista L;
    TipoItem e;
    if(p!=NULL)
    {
        FLVazia(&L);
        while(fscanf(p,"%c %d %d %d ",&e.evento,&e.dia,&e.mes,&e.ano)!=0 && fgets(e.descricao,26,p)!=NULL)
        {
            //fscanf(p,"%c %d %d %d ",&e.evento,&e.dia,&e.mes,&e.ano);
            //fgets(e.descricao,26,p);
            for(s=0; s<sizeof(Escolha); s++)
            {
                if(e.ano == ano && e.mes == mes && e.evento==Escolha[s])
                {
                    //printf("%c %d %d %d %s\n",e.evento,e.dia,e.mes,e.ano,e.descricao);
                    //printf("***%d***S",s);
                    Insere(e,&L);
                }
                if(e.ano == 0 && e.mes == mes && e.evento==Escolha[s])
                    {
                        e.ano=ano;
                        Insere(e,&L);
                        printf("entrou");
                    }
                if(e.mes == 0 && e.evento==Escolha[s])
                    {
                        e.mes=mes;
                        Insere(e,&L);
                        printf("entrou");
                    }
            }
        }
        //ordena(&L);
        printCar(ano,mes,L,idioma);
        //Imprime(L);
    }
    fclose(p);
    free(p);
}

void inicializa(int mes, int ano, int idioma, char*nome_arq)
{
    char Eaux[4];
    int E[4], k=0, j=0;
    if(mes<1 || mes>12)
    {
        printf("Erro, mes invalido!\n");
    }
    else
    {
        if(idioma==0 || idioma== 1)
        {
            printf("Digite os eventos a serem impressos(1-Aniversario, 2-Feriado,3-Viagem,4-Outros):\n");
            printf("Digite '*' ao terminar caso o numero de tipos de eventos seja menor que 4\n");
            fflush(stdin);
            while(scanf("%d",&E[j])!=0)
            {
                if(E[j]<1 || E[j]>4)
                {
                    printf("Erro! Digite apenas os numeros especificados!");
                    printf("1-Aniversario, 2-Feriado,3-Viagem,4-Outros:\n");
                    continue;
                }
                j++;
                if(j==4)
                    break;
            }
            for(k=0; k<j; k++)
            {
                if(E[k]==1)
                    Eaux[k]='A';
                if(E[k]==2)
                    Eaux[k]='F';
                if(E[k]==3)
                    Eaux[k]='V';
                if(E[k]==4)
                    Eaux[k]='O';
            }
            Le_arquivo(nome_arq,mes,ano,Eaux,idioma);
        }
        else
            printf("idioma invalido!");
    }
}
