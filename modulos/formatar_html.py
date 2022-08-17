file = open('./publico/inventario.html', 'r')
linhas = file.readlines()
file.close()
for linha in linhas:
  if linha != '    \n' and linha != '\n':
    print(linha.strip('\n'))
