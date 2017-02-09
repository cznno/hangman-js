#include <stdio.h>
#include <string.h>
#include <ctype.h>

int main(int argc, char* argv[])
{
    char str[256] = {0};
    int len = 0;
    char* fileIn="input.txt";
    long numProcsed=0;
    long numPassed=0;

    //Read Dict File
    if(argv[1] != 0)
    {
        fileIn=argv[1];
    }
    FILE *fpIn = fopen(fileIn, "r");
    FILE *fpOut = fopen("output.txt",  "w");

    if(NULL == fpIn)
    {
        printf("failed to open dos.txt\n");
        return 1;
    }

    //Format Dict File & Save Output
    fprintf(fpOut,"var dict=new Array();");
    fprintf(fpOut,"dict=[");
    while(!feof(fpIn))
    {
        memset(str, 0, sizeof(str));
        fgets(str, sizeof(str) - 1, fpIn);
        int l=strlen(str);
        int n=0;
        int flag=-1;
        int i=0;
        for (i=0;i<=l-n;i++){
          if(str[i] == '-' || str[i]=='\'')
          {
            flag=1;
            numPassed++;
          }else{
            str[i] = toupper(str[i]);
          }
        }
        if(flag==-1){
            str[strlen(str)]=0;
            fprintf(fpOut, "\"%s\",", str);
            //printf("%s\n", str);
            numProcsed++;
        }
        system("cls");
        printf("Processed %d lines\n",numProcsed);
        printf("Passed %d lines",numPassed);
    }
    fseek(fpOut,-1,SEEK_CUR);
    fprintf(fpOut,"];");

    //and..finish it well
    fclose(fpIn);
    fclose(fpOut);
    printf("\n\n-------Done!-------");
    getchar();
    return 0;
}
