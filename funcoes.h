typedef struct TipoItem_
{
    char evento;
    int dia;
    int mes;
    int ano;
    char descricao[26];
} TipoItem;
typedef struct Celula_str *Apontador;
typedef struct Celula_str
{
    TipoItem Item;
    Apontador Prox;
} Celula;
typedef struct TipoLista_
{
    Apontador Primeiro, Ultimo;
} TipoLista;

int getDayCode(int year);
int getFirstDay(int year,int month);
void printCar(int year, int month,TipoLista Lista,int idioma);
void FLVazia(TipoLista *Lista);
void Insere(TipoItem x, TipoLista *Lista);
void Imprime(TipoLista Lista);
void ordena(TipoLista *Lista);
void Le_arquivo(char*nome_arq,int mes,int ano,char*Escolha,int idioma);
void inicializa(int mes, int ano, int idioma, char*nome_arq);
