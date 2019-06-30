#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include "funcoes.c"

int main()
{
    int m, a, lang;
    char na[20];
    printf("Insira o numero do mes (1 a 12) seguido do ano que deseja: ");
    scanf("%d %d",&m,&a);
    printf("Digite 0 para Portugues ou 1 para Ingles: ");
    fflush(stdin);
    scanf("%d",&lang);
    printf("Digite o nome do arquivo: ");
    fflush(stdin);
    scanf("%s",na);
    inicializa(m,a,lang,na);
    getchar();
    return 0;
}
