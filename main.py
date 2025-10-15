import googlemaps
import os

API_KEY = "AIzaSyDJlw6JllFn7rd3YCD-4z-Y_A5CpxzAPx8"


try: 
    gmaps = googlemaps.Client(key=API_KEY)
except Exception as e:
    print(f"Erro ao inicializar o cliente do Google Maps: {e}")
    exit()
    
os.system('cls' if os.name == 'nt' else 'clear')

print("Por favor, forneça as informações abaixo.")

origem = input("Ponto de partida: ")
destino = input("Ponto de destino: ")

try:
    preco_gasolina = float(input("Preco do litro da gasolina (ex: 5.89) R$ "))
    consumo_veiculo = float(input("Consumo do seu veículo (Km por Litro): "))
    
except ValueError:
    print("\n Erro: valor inválido para preço ou consumo. Por favor, use números.")
    exit()
    
print("\nBuscando rota e calculando... Aguarde um momento.\n")

try:
    resultado_direcoes = gmaps.directions(origem,
                                          destino,
                                          mode="driving",
                                          language="pt-BR")
    
    if not resultado_direcoes:
        print(f"Não foi possível encontrar uma rota entre '{origem}' e '{destino}'")
        exit()
        
    distancia_em_metros = resultado_direcoes[0]['legs'][0]['distance']['value']
    distancia_texto = resultado_direcoes[0]['legs'][0]['distance']['text']
    duracao_texto = resultado_direcoes[0]['legs'][0]['duration']['text']
    
    distancia_em_km = distancia_em_metros / 1000
    litros_necessarios = distancia_em_km / consumo_veiculo
    custo_total = litros_necessarios * preco_gasolina
    
    print("--- RESULTADO DA SUA VIAGEM ---")
    print(f"Origem {origem}")
    print(f"Destino: {destino}")
    print("-" * 30)
    print(f"Distância total: {distancia_texto} (Duração: {duracao_texto})")
    print(f"Litros de gasolina necessários: {litros_necessarios:.2f} L")
    print(f"Custo total da viagem: R$ {custo_total:.2f}")
    print("-" * 30)
    
except googlemaps.exceptions.ApiError as e:
    print(f"Erro na API do Google Maps: {e}")
except Exception as e:
    print(f"Ocorreu um erro inseperado: {e}")